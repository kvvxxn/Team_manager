from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import crud, models, schemas
from database import get_db
from auth import verify_password

router = APIRouter(
    prefix="/api/auth",
    tags=["auth"],
)

@router.post("/signup", response_model=schemas.User)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return crud.create_player(db=db, user=user)

@router.post("/login")
def login(user_credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = crud.get_user_by_username(db, username=user_credentials.username)
    if not user:
        raise HTTPException(status_code=403, detail="Invalid Credentials")
    
    if not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(status_code=403, detail="Invalid Credentials")
    
    team_info = None
    if user.team:
        team_info = { "id": user.team.id, "name": user.team.name, "emblem": user.team.emblem }

    # For simplicity, returning user data. In production, return JWT token.
    return {
        "message": "Login successful", 
        "user_id": user.id, 
        "username": user.username, 
        "name": user.name,
        "role": user.role,
        "position_football": user.position_football,
        "position_futsal": user.position_futsal,
        "team": team_info # 팀 정보 객체 반환
    }
