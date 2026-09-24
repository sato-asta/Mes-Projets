from app.models.budget import Budget, Expense
from fastapi import APIRouter, HTTPException, Depends
from app.database import db
from app.auth import get_current_user
from bson import ObjectId

router = APIRouter()

def format_budget(budget):
    """Converts the budget document's ObjectId to a string for JSON serialization."""
    budget["_id"] = str(budget["_id"])
    return budget

def calculer_capacite(salary: float, expenses: list) -> dict:
    """Computes monthly and annual spending capacity from salary and list of expenses."""
    total_expenses = sum(expense["amount"] for expense in expenses)

    monthly_capacity = salary - total_expenses
    annual_capacity = monthly_capacity * 12
    expenses_percentage = (total_expenses / salary) * 100 if salary > 0 else 0

    return {
        "salary": salary,
        "total_expenses": total_expenses,
        "monthly_capacity": monthly_capacity,
        "annual_capacity": annual_capacity,
        "expenses_percentage": expenses_percentage
    }

@router.post("/budgets")
def create_budget(budget: Budget, current_user: dict = Depends(get_current_user)):
    """Creates a new budget for the authenticated user."""
    try:
        if budget.user_id != current_user["email"]:
            raise HTTPException(status_code=403, detail="Vous ne pouvez créer un budget que pour vous-même")
        
        user = db.users.find_one({"email": budget.user_id})
        if not user:
            raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

        existing_budget = db.budgets.find_one({"user_id": budget.user_id})
        if existing_budget:
            raise HTTPException(status_code=400, detail="Budget déjà existant pour cet utilisateur")

        budget_dict = budget.model_dump()
        budget_dict["calculs"] = calculer_capacite(budget.salary, [e.model_dump() for e in budget.expenses])

        result = db.budgets.insert_one(budget_dict)

        return {"id": str(result.inserted_id), "message": "Budget créé", "calculs": budget_dict["calculs"]}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating budget for {budget.user_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/budgets/{user_id}")
def get_budget(user_id: str, current_user: dict = Depends(get_current_user)):
    """Returns the budget of the authenticated user."""
    try:
        if user_id != current_user["email"]:
            raise HTTPException(status_code=403, detail="Vous ne pouvez accéder qu'à votre propre budget")
        
        budget = db.budgets.find_one({"user_id": user_id})
        if not budget:
            raise HTTPException(status_code=404, detail="Budget non trouvé pour cet utilisateur")
        return format_budget(budget)
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching budget for {user_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.put("/budgets/{user_id}/salary")
def update_salary(user_id: str, salary: float, current_user: dict = Depends(get_current_user)):
    """Updates the salary in the user's budget and recomputes spending capacity."""
    try:
        if user_id != current_user["email"]:
            raise HTTPException(status_code=403, detail="Vous ne pouvez modifier que votre propre budget")
        
        budget = db.budgets.find_one({"user_id": user_id})
        if not budget:
            raise HTTPException(status_code=404, detail="Budget non trouvé pour cet utilisateur")

        calculs = calculer_capacite(salary, budget.get("expenses", []))
        db.budgets.update_one({"user_id": user_id}, {"$set": {"salary": salary, "calculs": calculs}})
        return {"message": "Salaire mis à jour", "calculs": calculs}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating salary for {user_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.put("/budgets/{user_id}/expenses")
def add_expense(user_id: str, expense: Expense, current_user: dict = Depends(get_current_user)):
    """Adds a new expense to the user's budget and recomputes spending capacity."""
    try:
        if user_id != current_user["email"]:
            raise HTTPException(status_code=403, detail="Vous ne pouvez modifier que votre propre budget")
        
        budget = db.budgets.find_one({"user_id": user_id})
        if not budget:
            raise HTTPException(status_code=404, detail="Budget non trouvé pour cet utilisateur")

        db.budgets.update_one({"user_id": user_id}, {"$push": {"expenses": expense.model_dump()}})

        expenses = budget.get("expenses", [])
        expenses.append(expense.model_dump())
        calculs = calculer_capacite(budget.get("salary"), expenses)
        db.budgets.update_one({"user_id": user_id}, {"$set": {"calculs": calculs}})

        return {"message": "Dépense ajoutée", "calculs": calculs}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error adding expense for {user_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.delete("/budgets/{user_id}/expenses/{expense_index}")
def delete_expense(user_id: str, expense_index: int, current_user: dict = Depends(get_current_user)):
    """Deletes an expense by index from the user's budget and recomputes spending capacity."""
    try:
        if user_id != current_user["email"]:
            raise HTTPException(status_code=403, detail="Vous ne pouvez modifier que votre propre budget")
        
        budget = db.budgets.find_one({"user_id": user_id})
        if not budget:
            raise HTTPException(status_code=404, detail="Budget non trouvé pour cet utilisateur")

        expenses = budget.get("expenses", [])
        if expense_index < 0 or expense_index >= len(expenses):
            raise HTTPException(status_code=400, detail="Index de dépense invalide")

        expenses.pop(expense_index)
        calculs = calculer_capacite(budget.get("salary"), expenses)
        db.budgets.update_one({"user_id": user_id}, {"$set": {"expenses": expenses, "calculs": calculs}})

        return {"message": "Dépense supprimée", "calculs": calculs}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting expense {expense_index} for {user_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/budgets/{user_id}/calculs")
def get_calculs(user_id: str, current_user: dict = Depends(get_current_user)):
    """Returns the computed financial capacity breakdown for the user's budget."""
    try:
        if user_id != current_user["email"]:
            raise HTTPException(status_code=403, detail="Vous ne pouvez accéder qu'à vos propres calculs")
        
        budget = db.budgets.find_one({"user_id": user_id})
        if not budget:
            raise HTTPException(status_code=404, detail="Budget non trouvé pour cet utilisateur")

        return calculer_capacite(budget.get("salary"), budget.get("expenses", []))
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error computing calculs for {user_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
