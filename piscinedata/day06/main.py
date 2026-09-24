from task00 import make_dataframe
from task01 import get_departments

df = make_dataframe("./real_estate.csv")
d = get_departments(df)
print(d)