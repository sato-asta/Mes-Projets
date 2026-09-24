import sqlite3
from typing_extensions import Tuple


def peace_prizes(db_name: str)->list[Tuple[int, str]]:
    try:
        with sqlite3.connect(db_name) as conn:
            cur = conn.cursor()

            cur.execute('''
            SELECT p.year, l.name
            FROM prize p
            JOIN laureate l ON p.laureate_id = l.id
            JOIN category c ON p.category_id = c.id
            WHERE c.name = 'peace'
            ORDER BY p.year DESC, l.name ASC
            ''')

            results = cur.fetchall()
            return [(year, name) for year, name in results]
    except sqlite3.OperationalError as e:
        print("Failed to query Peace prizes:", e)
        return []