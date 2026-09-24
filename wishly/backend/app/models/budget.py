from pydantic import BaseModel
from typing import Optional, List

class Expense(BaseModel):
    name: str
    amount: float
    category: str = ""

class Budget(BaseModel):
    user_id: str
    salary: float = 0.0
    expenses: Optional[List[Expense]] = []