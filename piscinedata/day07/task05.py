import sqlite3
from task00 import load_json

def insert_laureates(json_file: str, db_name: str)->None:
    data = load_json(json_file)
    laureates = data.get("laureates", [])
    names = sorted(
        (f"{laureate.get('firstname', '')} {laureate.get('surname', '')}").strip()
        for laureate in laureates
    )

    try:
        with sqlite3.connect(db_name) as connection:
            cursor = connection.cursor()

            for name in names:
                cursor.execute(
                    "INSERT INTO laureate (name) VALUES (?)",
                    (name,)
                )

            connection.commit()
            print("Laureates inserted successfully.")
    except sqlite3.OperationalError as e:
        print("Failed to insert laureates:", e)
