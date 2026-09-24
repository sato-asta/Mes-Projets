import json
import os

class CarsDB:
    def __init__(self):
        base_directory = os.path.dirname(os.path.abspath(__file__))
        json_path = os.path.join(base_directory, "data", "cars.json")
        with open(json_path, "r", encoding="utf-8") as file:
            self.data = json.load(file)["marques"]

    def get_car_info(self, message: str) -> str:
        message = message.lower()
        
        for brand, info in self.data.items():
            if brand in message:
                
                for model_name, model_info in info["modeles"].items():
                    if model_name.lower() in message:
                        return f"{brand.capitalize()} {model_name} : {model_info['puissance']}, 0-100 en {model_info['0_100']}, prix {model_info['prix']}"
                
                modeles = ", ".join(info["modeles"].keys())
                
                return f"{brand.capitalize()} ({info['origine']}, fondée en {info['fondation']}) - Modèles : {modeles}. {info['caracteristique']}"
        
        return None