def display_multiple_laureates(db):
    counts = {}

    for prize in db["prizes"].find({}, {"laureates": 1}):
        for laureate in prize.get("laureates", []):
            laureate_id = laureate.get("id")
            if laureate_id:
                counts[laureate_id] = counts.get(laureate_id, 0) + 1

    result = []
    for laureate_id, total in counts.items():
        if total > 1:
            result.append(laureate_id)

    print(result)
    return result
