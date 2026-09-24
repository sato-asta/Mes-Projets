import json
import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGODB_URI", "mongodb://localhost:27017/"))
db = client[os.getenv("MONGODB_DB", "wishlist_db")]

def import_users():
    """Imports users from the fixture JSON file into MongoDB, skipping existing ones."""
    with open("fixtures/users.json", "r") as file:
        users = json.load(file)
    
    for user in users:
        existing_user = db.users.find_one({"email": user["email"]})
        
        if not existing_user:
            db.users.insert_one(user)
            print(f"User {user['email']} imported.")
        else:
            print(f"User {user['email']} already exists, skipping")


def import_budgets():
    """Imports budgets from the fixture JSON file into MongoDB, skipping existing ones."""
    with open("fixtures/budgets.json", "r") as file:
        budgets = json.load(file)
    
    for budget in budgets:
        existing_budget = db.budgets.find_one({"user_id": budget["user_id"]})
        
        if not existing_budget:
            db.budgets.insert_one(budget)
            print(f"Budget for user {budget['user_id']} imported.")
        else:
            print(f"Budget for user {budget['user_id']} already exists, skipping")

import_budgets()
import_users()
print("import finished")