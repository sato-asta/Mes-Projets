from pymongo import MongoClient

def get_db(host: str, port: int, db_name: str):
    client = MongoClient(host, port)
    db = client[db_name]
    return db
