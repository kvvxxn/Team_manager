from fastapi import FastAPI
from .database import engine, Base
from .routers import players, matches, finances

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Team Manager API",
    description="Backend for Team Manager Application",
    version="1.0.0",
)

# Include routers
app.include_router(players.router)
app.include_router(matches.router)
app.include_router(finances.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Team Manager API"}
