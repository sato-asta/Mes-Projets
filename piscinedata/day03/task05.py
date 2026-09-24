def display_french_NP(db):
    french_codes = set()

    for country in db["countries"].find({}, {"name": 1, "code": 1}):
        if "France" in country.get("name", ""):
            french_codes.add(country.get("code"))

    french_ids = set()
    for person in db["laureates"].find({"bornCountryCode": {"$in": list(french_codes)}}, {"id": 1}):
        french_ids.add(person["id"])

    result = []
    for prize in db["prizes"].find({}):
        for laureate in prize.get("laureates", []):
            if laureate.get("id") in french_ids:
                result.append((prize.get("year"), prize.get("category")))
                break

    print(result)
    return result
