import sqlite3

def prizes_by_category(db_name: str) -> list[list[int]]:
    try:
        with sqlite3.connect(db_name) as conn:
            cur = conn.cursor()

            cur.execute('''
            SELECT c.name, COUNT(p.id) AS prize_count
            FROM category c
            JOIN prize p ON c.id = p.category_id
            GROUP BY c.id
            ORDER BY prize_count DESC, c.name ASC
            ''')

            results = cur.fetchall()
            return [[name, count] for name, count in results]
    except sqlite3.OperationalError as e:
        print("Failed to query prizes by category:", e)
        return []
