"""
Backend session management using JWT tokens.

Provides secure session token creation and validation using HS256 algorithm,
separate from Google OAuth tokens for proper session lifecycle management.
"""

import jwt
from datetime import datetime, timedelta, timezone
from typing import Dict, Any, Optional
from fastapi import HTTPException

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)

# Session token settings
SESSION_ALGORITHM = "HS256"
SESSION_EXPIRY_HOURS = 24
COOKIE_NAME = "pm_session"


def create_session_token(user_id: str, email: str, additional_claims: Optional[Dict[str, Any]] = None) -> str:
    """
    Create a backend session token using HS256 JWT.
    
    Args:
        user_id: User identifier (typically email or sub from Google token)
        email: User email address
        additional_claims: Optional additional claims to include in token
        
    Returns:
        str: Signed JWT session token
        
    Raises:
        Exception: If token creation fails
    """
    now = datetime.now(timezone.utc)
    expiry = now + timedelta(hours=SESSION_EXPIRY_HOURS)
    
    # Base claims
    payload = {
        "user_id": user_id,
        "email": email,
        "iat": now,
        "exp": expiry,
        "iss": "pluginmind-backend",
        "aud": "pluginmind-frontend"
    }
    
    # Add any additional claims
    if additional_claims:
        payload.update(additional_claims)
    
    try:
        token = jwt.encode(
            payload, 
            settings.backend_session_secret, 
            algorithm=SESSION_ALGORITHM
        )
        
        logger.info(f"Created session token for user: {email}")
        return token
        
    except Exception as e:
        logger.error(f"Failed to create session token: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create session token")


def verify_session_token(token: str) -> Dict[str, Any]:
    """
    Verify and decode a backend session token.
    
    Args:
        token: JWT session token string
        
    Returns:
        Dict[str, Any]: Token payload with user information
        
    Raises:
        HTTPException: 401 if token is invalid, expired, or malformed
    """
    if not token:
        raise HTTPException(status_code=401, detail="Session token is required")
    
    try:
        # Decode and verify the token
        payload = jwt.decode(
            token,
            settings.backend_session_secret,
            algorithms=[SESSION_ALGORITHM],
            audience="pluginmind-frontend",
            issuer="pluginmind-backend"
        )
        
        # Validate required claims
        user_id = payload.get("user_id")
        email = payload.get("email")
        
        if not user_id or not email:
            raise HTTPException(status_code=401, detail="Invalid session token: missing required claims")
        
        logger.debug(f"Verified session token for user: {email}")
        return payload
        
    except jwt.ExpiredSignatureError:
        logger.warning("Session token expired")
        raise HTTPException(status_code=401, detail="Session expired")
    except jwt.InvalidTokenError as e:
        logger.warning(f"Invalid session token: {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid session token")
    except Exception as e:
        logger.error(f"Unexpected error verifying session token: {str(e)}")
        raise HTTPException(status_code=401, detail="Session verification failed")


def get_cookie_settings(secure: bool = False) -> Dict[str, Any]:
    """
    Get session cookie settings based on environment.
    
    Args:
        secure: Whether to set Secure flag (for HTTPS/production)
        
    Returns:
        Dict[str, Any]: Cookie settings for FastAPI Response.set_cookie()
    """
    settings_dict = {
        "key": COOKIE_NAME,
        "httponly": True,
        "samesite": "lax",
        "secure": secure,
        "path": "/",
        "max_age": SESSION_EXPIRY_HOURS * 3600  # Convert hours to seconds
    }
    # Optionally set cookie domain for cross-subdomain deployments
    if getattr(settings, "session_cookie_domain", None):
        settings_dict["domain"] = settings.session_cookie_domain
    return settings_dict


def get_logout_cookie_settings() -> Dict[str, Any]:
    """
    Get cookie settings for logout (clear session cookie).
    
    Returns:
        Dict[str, Any]: Cookie settings to clear session cookie
    """
    settings_dict = {
        "key": COOKIE_NAME,
        "value": "",
        "httponly": True,
        "samesite": "lax",
        "secure": False,  # Allow clearing on both HTTP and HTTPS
        "path": "/",
        "max_age": 0  # Expire immediately
    }
    if getattr(settings, "session_cookie_domain", None):
        settings_dict["domain"] = settings.session_cookie_domain
    return settings_dict
