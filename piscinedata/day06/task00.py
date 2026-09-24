import pandas as pd

def make_dataframe(path: str):
    df = pd.read_csv(path, sep=";")

    if "Latitude" in df.columns:
        df = df[df["Latitude"].notna()]

    if "Longitude" in df.columns:
        df = df[df["Longitude"].notna()]

    return df
