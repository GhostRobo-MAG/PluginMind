"""
Authentication routes for Google OAuth integration.

Provides endpoints for Google ID token validation and user authentication
that integrate with the existing auth middleware and user management system.
"""

from fastapi import APIRouter, HTTPException, Depends, Response
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
import os

from app.core.logging import get_logger
from app.api.dependencies import SessionDep
from app.api.dependencies_rate_limit import RateLimiter
from app.middleware.auth import verify_google_id_token_claims, get_current_user
from app.middleware.session_auth import get_session_user
from app.models.database import User
from app.core.exceptions import AuthenticationError
from app.core.session import create_session_token, get_cookie_settings, get_logout_cookie_settings

logger = get_logger(__name__)
router = APIRouter()


class GoogleAuthRequest(BaseModel):
    """Request model for Google OAuth authentication."""
    id_token: str


class UserResponse(BaseModel):
    """User data response model matching frontend expectations."""
    id: str
    email: str
    name: Optional[str] = None
    picture: Optional[str] = None
    role: str = "USER"
    subscription_tier: str
    created_at: str
    is_active: bool


class AuthTokens(BaseModel):
    """Auth tokens response model (not used since we use Google tokens directly)."""
    access_token: str
    token_type: str = "bearer"
    expires_in: int = 3600  # 1 hour (Google ID token expiry)


class AuthResponse(BaseModel):
    """Complete authentication response."""
    status: str
    user: UserResponse


@router.post("/google")
async def google_auth(
    request: GoogleAuthRequest,
    response: Response,
    session: SessionDep,
    _rate_limit=RateLimiter  # Add rate limiting to auth endpoint
):
    """
    Google OAuth Authentication Endpoint - Session Binding
    
    Validates Google ID token once and creates backend session cookie.
    Creates new user if they don't exist in the system.
    
    Args:
        request: Google auth request with ID token
        response: FastAPI response object for setting cookies
        session: Database session
        
    Returns:
        AuthResponse: Authentication status and user data
        
    Raises:
        HTTPException: 400/401 for invalid tokens, 500 for server errors
    """
    logger.info("Processing Google OAuth authentication request")
    
    if not request.id_token:
        raise HTTPException(status_code=400, detail="ID token is required")
    
    try:
        # Verify Google ID token using existing middleware
        token_claims = verify_google_id_token_claims(request.id_token)
        
        # Extract user information from token
        email = token_claims.get("email")
        google_id = token_claims.get("sub")
        name = token_claims.get("name")
        picture = token_claims.get("picture")
        
        if not email or not google_id:
            raise HTTPException(status_code=400, detail="Invalid token: missing required claims")
        
        logger.info(f"Verified Google token for user: {email}")
        
        # Check if user exists in database by Google ID first, then email
        user = session.query(User).filter(User.google_id == google_id).first()
        if not user:
            # Also check by email in case user exists but without Google ID
            user = session.query(User).filter(User.email == email).first()
        
        if not user:
            # Create new user
            logger.info(f"Creating new user account for: {email}")
            user = User(
                email=email,
                google_id=google_id,
                subscription_tier="free",
                queries_used=0,
                queries_limit=10,
                is_active=True,
                created_at=datetime.now()
            )
            session.add(user)
            session.commit()
            session.refresh(user)
            logger.info(f"Created new user with ID: {user.id}")
        else:
            # Update existing user's Google ID if needed
            if user.google_id != google_id:
                logger.info(f"Updating Google ID for existing user: {email}")
                user.google_id = google_id
                session.commit()
            logger.info(f"Found existing user with ID: {user.id}")
        
        # Create session token with user info
        session_token = create_session_token(
            user_id=email,  # Use email as primary user identifier
            email=email,
            additional_claims={
                "user_db_id": str(user.id),
                "name": name,
                "picture": picture,
                "subscription_tier": user.subscription_tier
            }
        )
        
        # Set session cookie (check if we're in production for Secure flag)
        is_production = os.getenv("ENVIRONMENT", "development").lower() == "production"
        cookie_settings = get_cookie_settings(secure=is_production)
        response.set_cookie(value=session_token, **cookie_settings)
        
        # Create response data
        user_response = UserResponse(
            id=str(user.id),
            email=user.email,
            name=name,
            picture=picture,
            role="USER",
            subscription_tier=user.subscription_tier,
            created_at=user.created_at.isoformat(),
            is_active=user.is_active
        )
        
        logger.info(f"Authentication successful for user: {email}, session cookie set")
        return AuthResponse(status="ok", user=user_response)
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except AuthenticationError as e:
        logger.warning(f"Authentication failed: {str(e)}")
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error during authentication: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during authentication")


@router.post("/logout")
async def logout(
    response: Response,
    user_id: str = Depends(get_session_user)
):
    """
    Logout Endpoint
    
    Clears the backend session cookie to log out the user.
    
    Args:
        response: FastAPI response object for clearing cookies
        user_id: Current user ID from session (ensures user is authenticated)
        
    Returns:
        dict: Success message
    """
    logger.info(f"Processing logout request for user: {user_id}")
    
    # Clear the session cookie
    logout_cookie_settings = get_logout_cookie_settings()
    response.set_cookie(**logout_cookie_settings)
    
    logger.info(f"User logged out successfully: {user_id}")
    return {"status": "ok", "message": "Logged out successfully"}


@router.get("/validate")
async def validate_token(current_user: str = Depends(get_current_user)):
    """
    Token Validation Endpoint (Legacy - for Google ID tokens)
    
    Validates Google ID tokens. Use /me endpoint for session-based validation.
    
    Args:
        current_user: User ID from auth middleware
        
    Returns:
        dict: User validation info
    """
    logger.info(f"Google token validation successful for user: {current_user}")
    return {
        "valid": True,
        "user_id": current_user,
        "message": "Google token is valid"
    }


@router.get("/me")
async def get_current_user_info(
    session: SessionDep,
    user_id: str = Depends(get_session_user)
):
    """
    Get Current User Information
    
    Returns current user information based on session cookie authentication.
    
    Args:
        session: Database session
        user_id: User ID from session cookie
        
    Returns:
        UserResponse: Current user information
        
    Raises:
        HTTPException: 404 if user not found, 401 if session invalid
    """
    logger.info(f"Fetching user info for: {user_id}")
    
    # Look up user in database
    user = session.query(User).filter(User.email == user_id).first()
    if not user:
        logger.warning(f"User not found in database: {user_id}")
        raise HTTPException(status_code=404, detail="User not found")
    
    # Return user information
    user_response = UserResponse(
        id=str(user.id),
        email=user.email,
        name=user.email.split('@')[0],  # Fallback if no name stored
        picture=None,  # Will be filled from session token if available
        role="USER",
        subscription_tier=user.subscription_tier,
        created_at=user.created_at.isoformat(),
        is_active=user.is_active
    )
    
    logger.info(f"Successfully fetched user info for: {user_id}")
    return user_response