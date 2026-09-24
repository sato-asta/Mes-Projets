import json
import os

_DIR = os.path.dirname(os.path.abspath(__file__))
USER_FILE = os.path.join(_DIR, "users.json")
BUDGET_FILE = os.path.join(_DIR, "budgets.json")

def load_users():
    """Loads users from the JSON fixture file, returning an empty list on error."""
    if not os.path.exists(USER_FILE):
        return []

    with open(USER_FILE, "r") as file:
        try:
            users = json.load(file)
            return users
        except json.JSONDecodeError as e:
            print(f"Error loading {USER_FILE}: {e}")
            return []
        
def save_users(users):
    """Saves the users list to the JSON fixture file."""
    with open(USER_FILE, "w") as file:
        json.dump(users, file, indent=4, ensure_ascii=False)

def load_budgets():
    """Loads budgets from the JSON fixture file, returning an empty list on error."""
    if not os.path.exists(BUDGET_FILE):
        return []

    with open(BUDGET_FILE, "r") as file:
        try:
            budgets = json.load(file)
            return budgets
        
        except json.JSONDecodeError as e:
            print(f"Error loading {BUDGET_FILE}: {e}")
            return []
        
def save_budgets(budgets):
    """Saves the budgets list to the JSON fixture file."""
    with open(BUDGET_FILE, "w") as file:
        json.dump(budgets, file, indent=4, ensure_ascii=False)