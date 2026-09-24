import pandas as pd

def get_towns(df, department: str | None = None)-> list[dict]:
    towns = []
    seen = set()

    for i, row in df.iterrows():
        dep = str(row["Code INSEE du département"])
        name = row["Nom de la commune"]
        code = str(row["Code INSEE de la commune"])

        if pd.isna(name) or pd.isna(code):
            continue

        if department is not None:
            if dep != department:
                continue

        key = (name, code)

        if key not in seen:
            seen.add(key)
            towns.append({"name": name, "insee_code": code})

    towns.sort(key=lambda x: x["insee_code"])
    return towns
