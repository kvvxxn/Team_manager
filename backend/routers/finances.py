from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import crud, models, schemas
from database import get_db

router = APIRouter(
    prefix="/api/finances",
    tags=["finances"],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=list[schemas.Finance])
def read_finances(
    team_id: int, 
    year: int, 
    month: int, 
    db: Session = Depends(get_db)
):
    return crud.get_finances_by_month(db, team_id=team_id, year=year, month=month)

@router.get("/summary", response_model=dict)
def read_finances_summary(
    team_id: int,
    year: int,
    month: int,
    db: Session = Depends(get_db)
):
    summary = crud.get_finance_summary(db, team_id=team_id, year=year, month=month)
    return summary

@router.post("/", response_model=schemas.Finance)
def create_finance(finance: schemas.FinanceCreate, db: Session = Depends(get_db)):
    db_finance = crud.create_finance(db=db, finance=finance)
    return db_finance
