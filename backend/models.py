from sqlalchemy import Column, Integer, String, DateTime, Date, Enum as SqlEnum, ForeignKey
from sqlalchemy.orm import relationship
import enum
from datetime import datetime
from database import Base

class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"
    MANAGER = "MANAGER"
    MEMBER = "MEMBER"

class RankTier(str, enum.Enum):
    AMATEUR = "AMATEUR"
    SEMI_PRO = "SEMI_PRO"
    PRO = "PRO"
    WORLD_CLASS = "WORLD_CLASS"

class MatchStatus(str, enum.Enum):
    VOTING = "VOTING"
    CONFIRMED = "CONFIRMED"
    COMPLETED = "COMPLETED"

class VoteStatus(str, enum.Enum):
    ATTENDING = "ATTENDING"
    ABSENT = "ABSENT"
    PENDING = "PENDING"

class AssignedTeam(str, enum.Enum):
    TEAM_A = "TEAM_A"
    TEAM_B = "TEAM_B"
    NONE = "NONE"

class FinanceType(str, enum.Enum):
    INCOME = "INCOME"
    EXPENSE = "EXPENSE"

class RequestStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    emblem = Column(String(255), nullable=True) # 파일 경로 또는 URL
    monthly_fee = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    members = relationship("User", back_populates="team")
    join_requests = relationship("TeamJoinRequest", back_populates="team")

class TeamJoinRequest(Base):
    __tablename__ = "team_join_requests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    status = Column(SqlEnum(RequestStatus), default=RequestStatus.PENDING)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="join_requests")
    team = relationship("Team", back_populates="join_requests")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False) # 아이디 (ID)
    hashed_password = Column(String(100), nullable=False) # 비밀번호
    name = Column(String(50), nullable=False)
    phone_number = Column(String(20), nullable=True) # 전화번호
    position_football = Column(String(50), default="ALL") # 희망 포지션 (축구)
    position_futsal = Column(String(50), default="ALL") # 희망 포지션 (풋살)
    role = Column(SqlEnum(UserRole), default=UserRole.MEMBER)
    rank_tier = Column(SqlEnum(RankTier), default=RankTier.AMATEUR)
    # team_name = Column(String(100), nullable=True) # Deprecated
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)

    matches_played = Column(Integer, default=0)
    goals = Column(Integer, default=0)
    assists = Column(Integer, default=0)

    # Relationships
    team = relationship("Team", back_populates="members")
    join_requests = relationship("TeamJoinRequest", back_populates="user")
    votes = relationship("MatchVote", back_populates="user")
    finances = relationship("Finance", back_populates="user")
    mom_matches = relationship("Match", back_populates="mom_user", foreign_keys="Match.mom_user_id")


class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True)
    match_date = Column(DateTime, nullable=False)
    location = Column(String(100))
    status = Column(SqlEnum(MatchStatus), default=MatchStatus.VOTING)
    team_a_score = Column(Integer, default=0)
    team_b_score = Column(Integer, default=0)
    mom_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    # Relationships
    mom_user = relationship("User", back_populates="mom_matches", foreign_keys=[mom_user_id])
    votes = relationship("MatchVote", back_populates="match", cascade="all, delete-orphan")


class MatchVote(Base):
    __tablename__ = "match_votes"

    id = Column(Integer, primary_key=True, index=True)
    match_id = Column(Integer, ForeignKey("matches.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(SqlEnum(VoteStatus), default=VoteStatus.PENDING)
    assigned_team = Column(SqlEnum(AssignedTeam), default=AssignedTeam.NONE)

    # Relationships
    match = relationship("Match", back_populates="votes")
    user = relationship("User", back_populates="votes")


class Finance(Base):
    __tablename__ = "finances"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(SqlEnum(FinanceType), nullable=False)
    amount = Column(Integer, nullable=False)
    description = Column(String(200))
    date = Column(Date, nullable=False)

    # Relationships
    user = relationship("User", back_populates="finances")
