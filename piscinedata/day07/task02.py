import sqlite3


def creates_database(db_path: str):

    sql_statements = [

        """CREATE TABLE IF NOT EXISTS country (
                id INTEGER PRIMARY KEY,
                code TEXT,
                name TEXT
            );""",

        """CREATE TABLE IF NOT EXISTS category (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL
            );""",

        """CREATE TABLE IF NOT EXISTS laureate (
                id INTEGER PRIMARY KEY,
                bornCountry_id INTEGER,
                diedCountry_id INTEGER,
                name TEXT NOT NULL,
                gender TEXT,
                born DATE,
                died DATE,
                FOREIGN KEY (bornCountry_id) REFERENCES country (id),
                FOREIGN KEY (diedCountry_id) REFERENCES country (id)
            );""",

        """CREATE TABLE IF NOT EXISTS prize (
                id INTEGER PRIMARY KEY,
                laureate_id INTEGER,
                category_id INTEGER,
                motivation TEXT,
                year INTEGER,
                affiliation_id INTEGER,
                FOREIGN KEY (laureate_id) REFERENCES laureate (id)
            );"""
    ]

    try:
        connection = sqlite3.connect(db_path)
        print("Database Sqlite3.db formed.")
    except:
        print("Database Sqlite3.db not formed.")

    try:
        with sqlite3.connect(db_path) as connection:
            cursor = connection.cursor()

            for statement in sql_statements:
                cursor.execute(statement)

            connection.commit()

            print("Tables created successfully.")
    except sqlite3.OperationalError as e:
        print("Failed to create tables:", e)
