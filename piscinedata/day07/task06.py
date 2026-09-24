import sqlite3
from task00 import load_json

def insert_prizes(json_file: str, db_name: str) -> None:

    data = load_json(json_file)
    laureates = data.get("laureates", [])

    try:
        with (sqlite3.connect(db_name) as conn):
            cur = conn.cursor()

            for laureate in laureates:
                name = f"{laureate.get('firstname','')} {laureate.get('surname','')}".strip()
                cur.execute("SELECT id FROM laureate WHERE name = ?", (name,))
                result = cur.fetchone()
                laureate_id = result[0]

                for prize in laureate.get("prizes", []):
                    year = prize.get("year")
                    category = prize.get("category")

                    cur.execute("SELECT id FROM category WHERE name = ?", (category,))
                    result = cur.fetchone()
                    category_id = result[0]

                    affiliation_id = None
                    affilations = prize.get("affiliations") or []

                    for affilation in affilations:
                        if isinstance(affilation, dict):
                            country = affilation.get("country")
                            if country:
                                cur.execute("SELECT id FROM country WHERE name = ?", (country,))
                                result = cur.fetchone()
                                if result:
                                    affiliation_id = result[0]
                                break

                    cur.execute(
                        "INSERT INTO prize (laureate_id, category_id, year, affiliation_id) VALUES (?, ?, ?, ?)",
                        (laureate_id, category_id, year, affiliation_id)
                    )
            conn.commit()
            print("Prizes inserted successfully.")
    except sqlite3.OperationalError as e:
        print("Failed to insert prizes:", e)
