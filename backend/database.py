import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# MySQL Database URL format: mysql+pymysql://<username>:<password>@<host>/<dbname>
# Use environment variable if available (e.g., in Docker), otherwise default to local setting
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "mysql+pymysql://team_user:team_password@localhost/team_manager"
)

engine = create_engine(

    SQLALCHEMY_DATABASE_URL,
    # connect_args={"check_same_thread": False}  # Only needed for SQLite
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
