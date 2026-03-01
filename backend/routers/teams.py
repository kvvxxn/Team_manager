from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
import crud, models, schemas
from database import get_db
import shutil
import os

router = APIRouter(
    prefix="/api/teams",
    tags=["teams"],
)

UPLOAD_DIR = "uploads/emblems"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/", response_model=List[schemas.Team])
def read_teams(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    teams = crud.get_teams(db, skip=skip, limit=limit)
    return teams

@router.post("/", response_model=schemas.Team)
def create_team(
    name: str = Form(...),
    monthly_fee: int = Form(...),
    emblem: UploadFile = File(None),
    user_id: int = Form(...), # In production, get from current_user
    db: Session = Depends(get_db)
):
    emblem_path = None
    if emblem:
        file_location = f"{UPLOAD_DIR}/{emblem.filename}"
        with open(file_location, "wb+") as file_object:
            shutil.copyfileobj(emblem.file, file_object)
        emblem_path = file_location
    
    team_data = schemas.TeamCreate(name=name, monthly_fee=monthly_fee)
    return crud.create_team(db=db, team=team_data, creator_id=user_id, emblem_path=emblem_path)

@router.post("/{team_id}/join")
def request_join(team_id: int, user_id: int, db: Session = Depends(get_db)):
    # Simple join request
    return crud.create_join_request(db=db, user_id=user_id, team_id=team_id)

@router.get("/{team_id}/requests", response_model=List[schemas.TeamJoinRequest])
def read_requests(team_id: int, db: Session = Depends(get_db)):
    return crud.get_join_requests(db, team_id)

@router.post("/requests/{request_id}/approve")
def approve_request(request_id: int, db: Session = Depends(get_db)):
    return crud.process_join_request(db, request_id, models.RequestStatus.APPROVED)

@router.post("/requests/{request_id}/reject")
def reject_request(request_id: int, db: Session = Depends(get_db)):
    return crud.process_join_request(db, request_id, models.RequestStatus.REJECTED)
