"""
Session-based authentication middleware for PluginMind Backend.

Provides FastAPI dependencies for session cookie authentication,
replacing Google ID token dependencies for better session lifecycle management.
"""

from typing import Optional, Dict, Any
from fastapi import Request, HTTPException, Depends, Cookie
from app.core.session import verify_session_token
from app.core.logging import get_logger

logger = get_logger(__name__)


def get_session_user(
    request: Request,
    pm_session: Optional[str] = Cookie(None)
) -> str:
    """
    FastAPI dependency for required session-based authentication.
    
    Reads and verifies the pm_session cookie from the request.
    
    Args:
        request: FastAPI request object
        pm_session: Session cookie value (automatically injected by FastAPI)
        
    Returns:
        str: User ID from verified session token
        
    Raises:
        HTTPException: 401 if session is missing, invalid, or expired
    """
    if not pm_session:
        logger.warning("Authentication failed: No session cookie found")
        raise HTTPException(
            status_code=401, 
            detail="Authentication required. Please sign in to access this resource."
        )
    
    try:
        # Verify session token and extract user info
        payload = verify_session_token(pm_session)
        user_id = payload["user_id"]
        email = payload.get("email", "unknown")
        
        logger.debug(f"Session authentication successful for user: {email}")
        return user_id
        
    except HTTPException:
        # Re-raise HTTP exceptions from verify_session_token
        raise
    except Exception as e:
        logger.error(f"Unexpected error during session authentication: {str(e)}")
        raise HTTPException(status_code=401, detail="Session authentication failed")


def get_session_user_optional(
    request: Request,
    pm_session: Optional[str] = Cookie(None)
) -> Optional[str]:
    """
    FastAPI dependency for optional session-based authentication.
    
    Returns None if no session cookie is provided, otherwise verifies the session.
    
    Args:
        request: FastAPI request object
        pm_session: Session cookie value (automatically injected by FastAPI)
        
    Returns:
        Optional[str]: User ID from verified session token, or None if no session
        
    Raises:
        HTTPException: 401 if session exists but is invalid/expired
    """
    if not pm_session:
        logger.debug("No session cookie found, continuing without authentication")
        return None
    
    try:
        # Verify session token and extract user info
        payload = verify_session_token(pm_session)
        user_id = payload["user_id"]
        email = payload.get("email", "unknown")
        
        logger.debug(f"Optional session authentication successful for user: {email}")
        return user_id
        
    except HTTPException:
        # Re-raise HTTP exceptions from verify_session_token
        raise
    except Exception as e:
        logger.error(f"Unexpected error during optional session authentication: {str(e)}")
        raise HTTPException(status_code=401, detail="Session authentication failed")


def get_session_payload(
    request: Request,
    pm_session: Optional[str] = Cookie(None)
) -> Dict[str, Any]:
    """
    FastAPI dependency that returns the full session payload.
    
    Useful when you need access to additional claims in the session token.
    
    Args:
        request: FastAPI request object
        pm_session: Session cookie value (automatically injected by FastAPI)
        
    Returns:
        Dict[str, Any]: Full session token payload
        
    Raises:
        HTTPException: 401 if session is missing, invalid, or expired
    """
    if not pm_session:
        logger.warning("Authentication failed: No session cookie found")
        raise HTTPException(
            status_code=401, 
            detail="Authentication required. Please sign in to access this resource."
        )
    
    try:
        # Verify session token and return full payload
        payload = verify_session_token(pm_session)
        email = payload.get("email", "unknown")
        
        logger.debug(f"Session payload access for user: {email}")
        return payload
        
    except HTTPException:
        # Re-raise HTTP exceptions from verify_session_token
        raise
    except Exception as e:
        logger.error(f"Unexpected error retrieving session payload: {str(e)}")
        raise HTTPException(status_code=401, detail="Session authentication failed")


# Dependency aliases for cleaner imports
SessionUserDep = Depends(get_session_user)
OptionalSessionUserDep = Depends(get_session_user_optional)
SessionPayloadDep = Depends(get_session_payload)