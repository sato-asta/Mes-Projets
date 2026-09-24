import sqlite3
from task00 import load_json

def insert_categories(json_file: str, dp_name: str)->None:

    data = load_json(json_file)
    laureates = data.get("laureates", [])

    categories = sorted({
        prize.get("category")
        for laureate in laureates
        for prize in laureate.get("prizes", [])
        if prize.get("category")
    })

    try:
        with sqlite3.connect(dp_name) as connection:
            cursor = connection.cursor()

            for category in categories:
                cursor.execute(
                    "INSERT INTO category (name) VALUES (?)",
                    (category,)
                )

            connection.commit()
            print("Categories inserted successfully.")
    except sqlite3.OperationalError as e:
        print("Failed to insert categories:", e)
