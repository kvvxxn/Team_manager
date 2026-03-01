from sqlalchemy.orm import Session
from sqlalchemy import func
from . import models, schemas
from .auth import get_password_hash # Import password hashing function
from datetime import datetime

# --- Players ---
def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_players(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).order_by(models.User.rank_tier.desc(), models.User.goals.desc()).offset(skip).limit(limit).all()

def create_player(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        hashed_password=hashed_password,
        name=user.name,
        phone_number=user.phone_number,
        position_football=user.position_football,
        position_futsal=user.position_futsal,
        role=user.role,
        rank_tier=user.rank_tier,
        matches_played=user.matches_played,
        goals=user.goals,
        assists=user.assists
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_player_stats(db: Session, player_id: int, stats: schemas.UserCreate): # simplified update using UserCreate for now, ideally separate schema
    db_player = db.query(models.User).filter(models.User.id == player_id).first()
    if db_player:
        db_player.goals = stats.goals
        db_player.assists = stats.assists
        db_player.matches_played = stats.matches_played
        db.commit()
        db.refresh(db_player)
    return db_player

# --- Matches ---
def get_matches(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Match).order_by(models.Match.match_date).offset(skip).limit(limit).all()

def get_match(db: Session, match_id: int):
    return db.query(models.Match).filter(models.Match.id == match_id).first()

def create_match_vote(db: Session, vote: schemas.MatchVoteCreate):
    # Check if vote already exists for this match/user
    existing_vote = db.query(models.MatchVote).filter(
        models.MatchVote.match_id == vote.match_id,
        models.MatchVote.user_id == vote.user_id
    ).first()
    
    if existing_vote:
        existing_vote.status = vote.status
        db.commit()
        db.refresh(existing_vote)
        return existing_vote
    
    db_vote = models.MatchVote(
        match_id=vote.match_id,
        user_id=vote.user_id,
        status=vote.status
    )
    db.add(db_vote)
    db.commit()
    db.refresh(db_vote)
    return db_vote

def update_teams_balance(db: Session, match_id: int, balanced_teams: list):
    # This function expects a list of (user_id, assigned_team) tuples or dicts
    # Implementation depends on how the AI balance logic returns data
    # For now, placeholder logic
    pass

# --- Finances ---
def get_finances(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Finance).order_by(models.Finance.date.desc()).offset(skip).limit(limit).all()

def create_finance(db: Session, finance: schemas.FinanceCreate):
    db_finance = models.Finance(
        user_id=finance.user_id,
        type=finance.type,
        amount=finance.amount,
        description=finance.description,
        date=finance.date
    )
    db.add(db_finance)
    db.commit()
    db.refresh(db_finance)
    return db_finance

def get_finance_summary(db: Session):
    # Aggregate logic for summary
    income = db.query(func.sum(models.Finance.amount)).filter(models.Finance.type == models.FinanceType.INCOME).scalar() or 0
    expense = db.query(func.sum(models.Finance.amount)).filter(models.Finance.type == models.FinanceType.EXPENSE).scalar() or 0
    return {"income": income, "expense": expense, "balance": income - expense}
