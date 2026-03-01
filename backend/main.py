from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import players, matches, finances, auth, teams
from fastapi.staticfiles import StaticFiles

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Team Manager API",
    description="Backend for Team Manager Application",
    version="1.0.0",
)

# Static Files for Uploads
import os
os.makedirs("uploads/emblems", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# CORS 설정
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(players.router)
app.include_router(matches.router)
app.include_router(finances.router)
app.include_router(teams.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Team Manager API"}
