import json


def display_info() -> None:
    with open("nobels.json", "r") as file:
        data = json.load(file)

    for laureate in data["laureates"]:
        for prize in laureate.get("prizes", []):
            category = prize.get("category")
            if category:
                print(category)

    name = sorted(f"{laureates.get('firstname', '')} {laureates.get('surname', '')}".strip()
                  for laureates in data["laureates"])

    countries = set()
    for laureate in data["laureates"]:
        country_code = laureate.get("bornCountryCode")
        country_name = laureate.get("bornCountry")
        if country_code and country_name:
            countries.add(f"{country_code}|{country_name}")
    countries_sorted = sorted(countries)

    print(name)
    print(countries_sorted)