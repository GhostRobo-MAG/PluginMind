"""
User profile and usage endpoints.

Provides authenticated user access to their profile information,
usage statistics, and account management features.
"""

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from app.core.logging import get_logger
from app.api.dependencies import SessionDep
from app.middleware.session_auth import get_session_user
from app.services.user_service import user_service
from app.models.schemas import UserProfile, UserUsage
from app.core.exceptions import UserNotFoundError

logger = get_logger(__name__)
router = APIRouter()


class FrontendUserResponse(BaseModel):
    """User data response model matching frontend expectations."""
    id: str
    email: str
    name: Optional[str] = None
    picture: Optional[str] = None
    role: str = "USER"
    subscription_tier: str
    created_at: str
    is_active: bool


class UserProfileResponse(BaseModel):
    """Response wrapper for user profile matching frontend API expectations."""
    user: FrontendUserResponse


@router.get("/me", response_model=UserProfile)
async def get_current_user_profile(session: SessionDep, user_id: str = Depends(get_session_user)):
    """
    Get Current User Profile (Session Cookie Auth)
    
    Returns the authenticated user's profile information including
    email, subscription tier, account status, and creation date.
    
    Args:
        session: Database session
        user_id: Authenticated user ID from session cookie
        
    Returns:
        UserProfile: User profile information
        
    Raises:
        HTTPException: 404 if user not found
    """
    logger.info(f"Getting profile for user: {user_id}")
    
    # Get or create user (in case they haven't made any queries yet)
    user = user_service.get_or_create_user(session, user_id)
    
    if not user:
        raise UserNotFoundError("User not found")
    
    return UserProfile(
        id=user.id,
        email=user.email,
        google_id=user.google_id,
        subscription_tier=user.subscription_tier,
        is_active=user.is_active,
        created_at=user.created_at
    )


@router.get("/me/usage", response_model=UserUsage)
async def get_current_user_usage(session: SessionDep, user_id: str = Depends(get_session_user)):
    """
    Get Current User Usage Statistics
    
    Returns the authenticated user's query usage information including
    queries used, query limits, and remaining queries.
    
    Args:
        session: Database session  
        user_id: Authenticated user ID from session cookie
        
    Returns:
        UserUsage: User usage statistics
        
    Raises:
        HTTPException: 404 if user not found
    """
    logger.info(f"Getting usage stats for user: {user_id}")
    
    # Get or create user (in case they haven't made any queries yet)
    user = user_service.get_or_create_user(session, user_id)
    
    if not user:
        raise UserNotFoundError("User not found")
    
    remaining_queries = max(0, user.queries_limit - user.queries_used)
    
    return UserUsage(
        queries_used=user.queries_used,
        queries_limit=user.queries_limit,
        remaining_queries=remaining_queries,
        subscription_tier=user.subscription_tier,
        can_make_query=user_service.check_query_limit(user)
    )


@router.get("/profile", response_model=UserProfileResponse)
async def get_user_profile_for_frontend(session: SessionDep, user_id: str = Depends(get_session_user)):
    """
    Get User Profile for Frontend
    
    Returns user profile in format expected by frontend auth service.
    This endpoint matches the frontend's API call to /users/profile.
    
    Args:
        session: Database session
        user_id: Authenticated user ID from Google ID token
        
    Returns:
        UserProfileResponse: User profile wrapped in expected format
        
    Raises:
        HTTPException: 404 if user not found
    """
    logger.info(f"Getting frontend profile for user: {user_id}")
    
    # Get or create user (in case they haven't made any queries yet)
    user = user_service.get_or_create_user(session, user_id)
    
    if not user:
        raise UserNotFoundError("User not found")
    
    # Build response matching frontend expectations
    frontend_user = FrontendUserResponse(
        id=str(user.id),
        email=user.email,
        name=None,  # We don't store name in the User model currently
        picture=None,  # We don't store picture in the User model currently
        role="USER",
        subscription_tier=user.subscription_tier,
        created_at=user.created_at.isoformat(),
        is_active=user.is_active
    )
    
    return UserProfileResponse(user=frontend_user)
