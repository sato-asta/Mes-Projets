import pandas as pd

def get_prices(df, department_code, town_code,
               r_min=1, r_max=10,
               s_min=20.0, s_max=200.0):

    prices = []

    for i, row in df.iterrows():
        if pd.isna(row["Code INSEE du département"]) or pd.isna(row["Code INSEE de la commune"]):
            continue
        if pd.isna(row["Nombre de pièces principales"]) or pd.isna(row["Surface réelle du bâti"]) or pd.isna(row["Valeur foncière"]):
            continue

        dep = str(row["Code INSEE du département"])
        town = str(row["Code INSEE de la commune"])
        rooms = row["Nombre de pièces principales"]
        surface = row["Surface réelle du bâti"]
        price = row["Valeur foncière"]

        if department_code in df["Code INSEE du département"].astype(str).unique():
            if dep != department_code:
                continue

        if town_code in df["Code INSEE de la commune"].astype(str).unique():
            if town != town_code:
                continue

        if rooms < r_min or rooms > r_max:
            continue

        if surface < s_min or surface > s_max:
            continue

        prices.append({
            "department_code": dep,
            "town_code": town,
            "rooms": int(rooms),
            "surface": float(surface),
            "price": float(price)
        })

    return prices
