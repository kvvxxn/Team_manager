from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import crud, models, schemas
from database import get_db

router = APIRouter(
    prefix="/api/matches",
    tags=["matches"],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=list[schemas.Match])
def read_matches(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    matches = crud.get_matches(db, skip=skip, limit=limit)
    return matches

@router.get("/{match_id}", response_model=schemas.Match)
def read_match(match_id: int, db: Session = Depends(get_db)):
    db_match = crud.get_match(db, match_id=match_id)
    if not db_match:
        raise HTTPException(status_code=404, detail="Match not found")
    return db_match

@router.post("/{match_id}/vote", response_model=schemas.MatchVote)
def vote_match(match_id: int, vote: schemas.MatchVoteCreate, db: Session = Depends(get_db)):
    updated_vote = crud.create_match_vote(db=db, vote=vote)
    return updated_vote

@router.post("/{match_id}/balance")
def balance_teams(match_id: int, db: Session = Depends(get_db)):
    # AI logic to balance teams based on stats (simplified placeholder)
    # This logic would normally fetch users, sort by rank/stats, distribute evenly
    return {"message": "Teams balanced and saved"}
