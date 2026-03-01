from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum

# Forward references for models
class UserRole(str, Enum):
    ADMIN = "ADMIN"
    MANAGER = "MANAGER"
    MEMBER = "MEMBER"

class RankTier(str, Enum):
    AMATEUR = "AMATEUR"
    SEMI_PRO = "SEMI_PRO"
    PRO = "PRO"
    WORLD_CLASS = "WORLD_CLASS"

class MatchStatus(str, Enum):
    VOTING = "VOTING"
    CONFIRMED = "CONFIRMED"
    COMPLETED = "COMPLETED"

class VoteStatus(str, Enum):
    ATTENDING = "ATTENDING"
    ABSENT = "ABSENT"
    PENDING = "PENDING"

class AssignedTeam(str, Enum):
    TEAM_A = "TEAM_A"
    TEAM_B = "TEAM_B"
    NONE = "NONE"

class FinanceType(str, Enum):
    INCOME = "INCOME"
    EXPENSE = "EXPENSE"

# User Schemas
class UserBase(BaseModel):
    username: str
    name: str
    phone_number: Optional[str] = None
    position_football: Optional[str] = "ALL"
    position_futsal: Optional[str] = "ALL"
    role: Optional[UserRole] = UserRole.MEMBER
    rank_tier: Optional[RankTier] = RankTier.AMATEUR
    matches_played: Optional[int] = 0
    goals: Optional[int] = 0
    assists: Optional[int] = 0

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

# Match Schemas
class MatchBase(BaseModel):
    match_date: datetime
    location: Optional[str] = None
    status: Optional[MatchStatus] = MatchStatus.VOTING
    team_a_score: Optional[int] = 0
    team_b_score: Optional[int] = 0
    mom_user_id: Optional[int] = None

class MatchCreate(MatchBase):
    pass

class Match(MatchBase):
    id: int
    votes: List["MatchVote"] = []

    class Config:
        from_attributes = True

# MatchVote Schemas
class MatchVoteBase(BaseModel):
    match_id: int
    user_id: int
    status: Optional[VoteStatus] = VoteStatus.PENDING
    assigned_team: Optional[AssignedTeam] = AssignedTeam.NONE

class MatchVoteCreate(MatchVoteBase):
    pass

class MatchVote(MatchVoteBase):
    id: int
    # user: User  # Optional: include user details in vote response

    class Config:
        from_attributes = True

# Finance Schemas
class FinanceBase(BaseModel):
    user_id: int
    type: FinanceType
    amount: int
    description: Optional[str] = None
    date: datetime

class FinanceCreate(FinanceBase):
    pass

class Finance(FinanceBase):
    id: int

    class Config:
        from_attributes = True
