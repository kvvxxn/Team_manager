from database import engine
from sqlalchemy import text
from models import Base

def migrate():
    print("Running migration...")
    
    # 1. Create new tables (if not exist)
    Base.metadata.create_all(bind=engine)
    print("New tables (teams, team_join_requests) created/checked.")

    # 2. Alter 'users' table to add 'team_id'
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN team_id INT NULL"))
            print("Added 'team_id' column to 'users' table.")
        except Exception as e:
            print(f"Skipping 'team_id' column addition (might already exist): {e}")

        try:
            conn.execute(text("ALTER TABLE users ADD CONSTRAINT fk_user_team FOREIGN KEY (team_id) REFERENCES teams(id)"))
            print("Added foreign key constraint to 'users' table.")
        except Exception as e:
            print(f"Skipping FK constraint (might already exist): {e}")
            
        # Optional: Drop team_name column if you want to clean up
        # try:
        #     conn.execute(text("ALTER TABLE users DROP COLUMN team_name"))
        #     print("Dropped 'team_name' column from 'users'.")
        # except Exception as e:
        #     print(f"Skipping drop 'team_name': {e}")

    print("Migration complete.")

if __name__ == "__main__":
    migrate()
