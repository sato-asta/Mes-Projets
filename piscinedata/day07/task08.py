import sqlite3

def french_prizes(db_name: str)->list:
    try:
        with sqlite3.connect(db_name) as conn:
            cur = conn.cursor()

            cur.execute('''
            SELECT l.name
            FROM laureate l
            JOIN prize p ON l.id = p.laureate_id
            JOIN category c ON p.category_id = c.id
            JOIN country co ON p.affiliation_id = co.id
            WHERE co.name = 'France' AND c.name = 'Literature'
            ORDER BY p.year DESC, l.name ASC
            ''')

            results = cur.fetchall()
            return [name for name, in results]
    except sqlite3.OperationalError as e:
        print("Failed to query French prizes:", e)
        return []
