from fastapi import APIRouter, HTTPException, status, Depends  # ← Depends yahan add karo
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from app.models.user import UserCreate, UserResponse, Token, UserLogin
from app.core.security import security
from app.core.database import db
from app.core.config import settings
from app.api.deps import get_current_user  # ← Ye import bhi check karo
import uuid
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup", response_model=UserResponse)
async def signup(user_data: UserCreate):
    supabase = db.get_client()
    
    # Check if user exists
    existing = supabase.table("users").select("*").eq("email", user_data.email).execute()
    if existing.data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user
    user_id = str(uuid.uuid4())
    hashed_password = security.get_password_hash(user_data.password)
    
    user = {
        "id": user_id,
        "email": user_data.email,
        "full_name": user_data.full_name,
        "hashed_password": hashed_password,
        "created_at": datetime.utcnow().isoformat()
    }
    
    result = supabase.table("users").insert(user).execute()
    
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user"
        )
    
    return UserResponse(**result.data[0])

@router.post("/login", response_model=Token)
async def login(login_data: UserLogin):
    supabase = db.get_client()
    
    # Get user
    result = supabase.table("users").select("*").eq("email", login_data.email).execute()
    
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    user = result.data[0]
    
    # Verify password
    if not security.verify_password(login_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Create token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user["id"]}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def get_me(current_user = Depends(get_current_user)):
    return UserResponse(**current_user)