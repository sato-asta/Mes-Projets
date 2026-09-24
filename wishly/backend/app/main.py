from app.routes import items
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import whishlist
from app.routes import users
from app.routes import search
from app.routes import friends
from app.routes import budget
from app.routes import secret_santa

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://wishlyy.vercel.app"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

app.include_router(items.router)
app.include_router(whishlist.router)
app.include_router(users.router)
app.include_router(search.router)
app.include_router(friends.router)
app.include_router(budget.router)
app.include_router(secret_santa.router)
