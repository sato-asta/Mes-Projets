import sqlite3

def multiple_prizes(db_name: str) -> list:

    try:
        with sqlite3.connect(db_name) as conn:
            cur = conn.cursor()

            cur.execute("""
                SELECT l.name, COUNT(p.id) AS prize_count
                FROM laureate l
                JOIN prize p ON l.id = p.laureate_id
                GROUP BY l.id
                HAVING prize_count > 1
                ORDER BY prize_count DESC, l.name ASC
            """)

            results = cur.fetchall()
            return [(name, count) for name, count in results]

    except sqlite3.OperationalError as e:
        print("Failed to query multiple prizes:", e)
        return []
