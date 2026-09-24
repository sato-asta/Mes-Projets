import re

def detect_intent(message):
    message = message.lower()

    if any(word in message for word in ["météo", "weather", "temps"]):
        return "weather"
    
    if any(word in message for word in ["bonjour", "salut", "slt", "hello"]):
        return "greeting"
    
    if any(word in message for word in ["aide", "help", "comment réussir", "comment faire"]):
        return "help"
    
    if re.search(r'\b(match|foot|football|équipe|equipe)\b', message):
        return "football"
    
    if any(word in message for word in ["voiture", "car", "auto", "moteur", "sportive", "sportives"]):
        return "car"
    
    car_brands = ["tesla", "bmw", "audi", "mercedes", "renault", "peugeot",
                  "toyota", "ford", "ferrari", "bugatti", "mazda", "porsche",
                  "fiat", "corvette", "lamborghini", "volkswagen", "citroen",
                  "nissan", "honda", "hyundai", "kia", "jaguar", "land rover",
                  "subaru", "volvo", "mini", "alfa romeo", "maserati", "infiniti",
                  "lexus", "cadillac","dodge", "ram", "chevrolet", "chrysler", "jeep", "suzuki", "skoda"
    ]

    if any(brand in message for brand in car_brands):
        return "car"

    return "general"
