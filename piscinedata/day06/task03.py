import pandas as pd

def get_departement_prices(df):
    result = {}
    sums = {}
    counts = {}

    for i, row in df.iterrows():
        dep = str(row["Code INSEE du département"])
        price = row["Valeur foncière"]

        if pd.isna(price):
            continue

        if dep not in sums:
            sums[dep] = 0
            counts[dep] = 0

        sums[dep] += price
        counts[dep] += 1

    for dep in sorted(sums.keys()):
        result[dep] = sums[dep] / counts[dep]

    return result
