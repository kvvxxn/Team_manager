from sqlalchemy.orm import Session
from sqlalchemy import func
import models, schemas
from auth import get_password_hash # Import password hashing function
from datetime import datetime

# --- Players ---
def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_players(db: Session, skip: int = 0, limit: int = 100, team_id: int = None):
    query = db.query(models.User)
    if team_id:
        query = query.filter(models.User.team_id == team_id)
    return query.order_by(models.User.rank_tier.desc(), models.User.goals.desc()).offset(skip).limit(limit).all()

def create_player(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        hashed_password=hashed_password,
        name=user.name,
        phone_number=user.phone_number,
        position_football=user.position_football,
        position_futsal=user.position_futsal,
        # team_id is None by default
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

# --- Teams ---
def get_teams(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Team).offset(skip).limit(limit).all()

def create_team(db: Session, team: schemas.TeamCreate, creator_id: int, emblem_path: str = None):
    # 1. Create Team
    db_team = models.Team(
        name=team.name,
        monthly_fee=team.monthly_fee,
        emblem=emblem_path
    )
    db.add(db_team)
    db.commit()
    db.refresh(db_team)

    # 2. Assign creator as ADMIN of the team
    db_user = db.query(models.User).filter(models.User.id == creator_id).first()
    if db_user:
        db_user.team_id = db_team.id
        db_user.role = models.UserRole.ADMIN # Set role to ADMIN
        db.commit()
    
    return db_team

def create_join_request(db: Session, user_id: int, team_id: int):
    # Check if request already exists
    existing_request = db.query(models.TeamJoinRequest).filter(
        models.TeamJoinRequest.user_id == user_id, 
        models.TeamJoinRequest.team_id == team_id,
        models.TeamJoinRequest.status == models.RequestStatus.PENDING
    ).first()
    
    if existing_request:
        return existing_request # Already pending

    db_request = models.TeamJoinRequest(
        user_id=user_id,
        team_id=team_id
    )
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

def get_join_requests(db: Session, team_id: int):
    return db.query(models.TeamJoinRequest).filter(
        models.TeamJoinRequest.team_id == team_id,
        models.TeamJoinRequest.status == models.RequestStatus.PENDING
    ).all()

def process_join_request(db: Session, request_id: int, status: str): # status: APPROVED or REJECTED
    request = db.query(models.TeamJoinRequest).filter(models.TeamJoinRequest.id == request_id).first()
    if not request:
        return None
    
    request.status = status
    
    if status == models.RequestStatus.APPROVED:
        # Add user to team
        user = db.query(models.User).filter(models.User.id == request.user_id).first()
        if user:
            user.team_id = request.team_id
            user.role = models.UserRole.MEMBER
            
    db.commit()
    return request

def update_user_role(db: Session, user_id: int, new_role: str):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user:
        user.role = new_role
        db.commit()
        db.refresh(user)
    return user

def remove_user_from_team(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user:
        user.team_id = None
        user.role = models.UserRole.MEMBER # Reset role to default member behavior (or NONE if you have it)
        db.commit()
        db.refresh(user)
    return user

def get_finances_by_month(db: Session, team_id: int, year: int, month: int):
    start_date = date(year, month, 1)
    if month == 12:
        end_date = date(year + 1, 1, 1)
    else:
        end_date = date(year, month + 1, 1)
        
    return db.query(models.Finance).filter(
        models.Finance.team_id == team_id,
        models.Finance.date >= start_date,
        models.Finance.date < end_date
    ).order_by(models.Finance.date).all()

def get_finance_summary(db: Session, team_id: int, year: int, month: int):
    from datetime import date
    
    start_of_month = date(year, month, 1)
    if month == 12:
        end_of_month = date(year + 1, 1, 1)
    else:
        end_of_month = date(year, month + 1, 1)

    # 1. Previous Balance (Sum of all income - expenses before this month)
    prev_income = db.query(func.sum(models.Finance.amount)).filter(
        models.Finance.team_id == team_id,
        models.Finance.type == models.FinanceType.INCOME,
        models.Finance.date < start_of_month
    ).scalar() or 0
    
    prev_expense = db.query(func.sum(models.Finance.amount)).filter(
        models.Finance.team_id == team_id,
        models.Finance.type == models.FinanceType.EXPENSE,
        models.Finance.date < start_of_month
    ).scalar() or 0
    
    previous_balance = prev_income - prev_expense

    # 2. Current Month Income/Expense
    current_income = db.query(func.sum(models.Finance.amount)).filter(
        models.Finance.team_id == team_id,
        models.Finance.type == models.FinanceType.INCOME,
        models.Finance.date >= start_of_month,
        models.Finance.date < end_of_month
    ).scalar() or 0
    
    current_expense = db.query(func.sum(models.Finance.amount)).filter(
        models.Finance.team_id == team_id,
        models.Finance.type == models.FinanceType.EXPENSE,
        models.Finance.date >= start_of_month,
        models.Finance.date < end_of_month
    ).scalar() or 0

    return {
        "previous_balance": previous_balance,
        "current_income": current_income,
        "current_expense": current_expense,
        "total_balance": previous_balance + current_income - current_expense
    }

def create_finance(db: Session, finance: schemas.FinanceCreate):
    db_finance = models.Finance(
        user_id=finance.user_id,
        team_id=finance.team_id,
        type=finance.type,
        amount=finance.amount,
        description=finance.description,
        date=finance.date
    )
    db.add(db_finance)
    db.commit()
    db.refresh(db_finance)
    return db_finance
