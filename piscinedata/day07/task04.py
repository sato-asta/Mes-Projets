import sqlite3
from task00 import load_json

def insert_countries(json_file: str, db_name: str)->None:
    data = load_json(json_file)
    laureates = data.get("laureates", [])
    countries_serialized = {
        f"{laureate.get('bornCountryCode')}|{laureate.get('bornCountry')}"
        for laureate in laureates
        if laureate.get("bornCountryCode") and laureate.get("bornCountry")
    }
    countries_sorted = sorted(
        countries_serialized,
        key=lambda s: (s.split("|", 1)[0], s.split("|", 1)[1])
    )

    try:
        with sqlite3.connect(db_name) as connection:
            cursor = connection.cursor()

            for country in countries_sorted:
                code, name = country.split("|", 1)
                cursor.execute(
                    "INSERT INTO country (code, name) VALUES (?, ?)",
                    (code, name)
                )

            connection.commit()
            print("Countries inserted successfully.")
    except sqlite3.OperationalError as e:
        print("Failed to insert countries:", e)
