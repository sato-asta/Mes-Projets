def display_categories(db):
    prizes = db["prizes"].find({}, {"category": 1})
    categories = sorted(
        {prize.get("category", "") for prize in prizes},
        key=lambda x: x.lower()
    )
    print(categories)
    return categories

def display_laureates(db):
    laureates = db["laureates"].find({}, {"firstname": 1, "surname": 1})

    names = []

    for laureate in laureates:
        firstname = laureate.get("firstname", "")
        surname = laureate.get("surname", "")

        if surname:
            names.append(f"{firstname} {surname}")
            return names
        names.append(firstname)

    names = sorted(names, key=lambda x: x.lower())
    print(names)
    return names

def display_countries(db):
    countries = db["countries"].find({}, {"name": 1, "code": 1})

    result = []
    for country in countries:
        result.append((country.get("name", ""), country.get("code", "")))

    result = sorted(result, key=lambda x: x[0].lower())
    print(result)
    return result