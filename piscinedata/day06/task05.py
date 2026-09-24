from flask import Flask
from task00 import make_dataframe

app = Flask(__name__)

df = make_dataframe("real_estate.csv")

@app.route("/")
def home():
    return "Hello Ace"
