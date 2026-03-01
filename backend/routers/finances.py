from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import crud, models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/api/finances",
    tags=["finances"],
    responses={404: {"description": "Not found"}},
)

@router.get("/summary", response_model=dict)
def read_finances_summary(db: Session = Depends(get_db)):
    summary = crud.get_finance_summary(db)
    return summary

@router.get("/members", response_model=list[schemas.Finance])
def read_finance_members(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    finances = crud.get_finances(db, skip=skip, limit=limit)
    return finances

@router.post("/", response_model=schemas.Finance)
def create_finance(finance: schemas.FinanceCreate, db: Session = Depends(get_db)):
    db_finance = crud.create_finance(db=db, finance=finance)
    return db_finance
