import json

def load_json(filepath: str)->dict:
    if not isinstance(filepath, str):
        raise TypeError("File path must be a string.")

    with open(filepath, 'r') as file:
        raw = file.read()
    return json.loads(raw)
