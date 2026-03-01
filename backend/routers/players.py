from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import crud, models, schemas
from database import get_db

router = APIRouter(
    prefix="/api/players",
    tags=["players"],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=list[schemas.User])
def read_players(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    players = crud.get_players(db, skip=skip, limit=limit)
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
