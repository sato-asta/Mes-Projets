import os
import json

def import_data(db, data_path: str):

    for filename in os.listdir(data_path):
        if filename.endswith(".json"):
            collection_name = filename.replace(".json", "")
            collection = db[collection_name]

            with open(os.path.join(data_path, filename), "r", encoding="utf-8") as f:
                data = json.load(f)

            if isinstance(data, list):
                collection.insert_many(data)
                return
            collection.insert_one(data)