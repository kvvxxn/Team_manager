from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import crud, models, schemas
from database import get_db

router = APIRouter(
    prefix="/api/players",
    tags=["players"],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[schemas.User])
def read_players(skip: int = 0, limit: int = 100, team_id: int = None, db: Session = Depends(get_db)):
    players = crud.get_players(db, skip=skip, limit=limit, team_id=team_id)
    return players

@router.post("/", response_model=schemas.User)
def create_player(player: schemas.UserCreate, db: Session = Depends(get_db)):
    db_player = crud.create_player(db=db, user=player)
    return db_player

@router.put("/{player_id}/stats", response_model=schemas.User)
def update_player_stats(player_id: int, stats: schemas.UserCreate, db: Session = Depends(get_db)):
    # Assuming UserCreate has the fields to update, or separate UserStatsUpdate schema is better
    db_player = crud.update_player_stats(db=db, player_id=player_id, stats=stats)
    if db_player is None:
        raise HTTPException(status_code=404, detail="Player not found")
    return db_player

@router.put("/{player_id}/role", response_model=schemas.User)
def update_player_role(player_id: int, role: str, db: Session = Depends(get_db)):
    db_player = crud.update_user_role(db, player_id, role)
    if db_player is None:
        raise HTTPException(status_code=404, detail="Player not found")
    return db_player

@router.delete("/{player_id}/team", response_model=schemas.User)
def remove_player_from_team(player_id: int, db: Session = Depends(get_db)):
    db_player = crud.remove_user_from_team(db, player_id)
    if db_player is None:
        raise HTTPException(status_code=404, detail="Player not found")
    return db_player
