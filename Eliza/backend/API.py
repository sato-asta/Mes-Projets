from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from model.generator import ChatbotModel
from logic.rooter import detect_intent
from logic.context import contextmanager
from logic.api_extern import APIsports
from utils.logger import logger
from logic.cars_api import CarsDB

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
model = ChatbotModel()
context_manager = contextmanager()
sport_api = APIsports()
users_db = {}
cars_db = CarsDB()

@app.get("/health")
def check_satus():
    return {"status": "ok", "model_loader": True}

@app.post("/register")
def register(payload: dict):
    username = payload.get("username", "")
    password = payload.get("password", "")

    if len(username) < 3:
        raise HTTPException(status_code=400, detail="Username must be at least 3 characters long")
    if len(password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters long")
    if username in users_db:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    users_db[username] = password
    return {"token": f"token-{username}", "username": username}

@app.post("/login")
def login(payload: dict):
    username = payload.get("username", "")
    password = payload.get("password", "")

    if username not in users_db or users_db[username] != password:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    return {"token": f"token-{username}", "username": username}

@app.post("/chat")
def chat(payload: dict):

    user_message = payload.get("message", "")
    logger.info(f"message received: {user_message}")
    context_manager.add_message("user", user_message)
    context_text = context_manager.build_context()
    intent = detect_intent(user_message)

    if intent == "football":
        keywords = ["football", "je voudrais", "parle", "parles", "équipe", "equipe", "de", "tu", "me", "que"]
        team_name = user_message.lower()
        for word in keywords:
            team_name = team_name.replace(word, "")
        team_name = team_name.strip()
        if team_name == "":
            team_name = "PSG"

        response = sport_api.get_team_knowledge(team_name)
        context_manager.add_message("assistant", response)

        return {
            "intent": intent,
            "response": response
        }
    
    if intent == "car":
        cars_info = cars_db.get_car_info(user_message)

        if cars_info:
            enriched_message = f"""Tu es un expert automobile. Voici les données réelles sur cette voiture :{cars_info}
                                En te basant sur ces informations, réponds à cette question : {user_message}"""
        else:
            enriched_message = f"""Tu es un expert automobile. Réponds uniquement sur le sujet des voitures,
                                    marques, modèles, performances, caractéristiques techniques.
                                    Si la question ne concerne pas les voitures, recentre la conversation.
                                    
                                    Question : {user_message}"""

        response = model.generate_response(enriched_message, context_text)
        context_manager.add_message("assistant", response)

        return {
            "intent": intent,
            "response": response
        }

    response = model.generate_response(user_message, context_text)
    context_manager.add_message("assistant", response)
    logger.info(f"AI response sent: {response}")
    return {
        "intent": intent,
        "response": response
    }
