from task05 import Budget

myBudget = Budget("data.json")

for category in myBudget.get_categories():
    myBudget.print_sorted_transactions(category)
print('---')
myBudget.print_transactions()