def display_shared_peace_NP(db):
    result = []

    peace_prizes = db["prizes"].find({"category": "peace"}, {"year": 1, "laureates": 1})

    for prize in peace_prizes:
        laureates = prize.get("laureates", [])
        if len(laureates) == 2:
            result.append((prize.get("year"), laureates))

    print(result)
    return result