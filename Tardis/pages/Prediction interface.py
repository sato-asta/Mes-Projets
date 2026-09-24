import streamlit as st
import pandas as pd
import joblib

df = pd.read_csv("cleaned_dataset.csv", sep=";")
model = joblib.load("model.pkl")

st.title("Prediction Interface")

st.write("Remplis les informations ci-dessous pour prédire le retard moyen d’un train à l’arrivée.")

service = st.selectbox("Service", sorted(df["Service"].astype(str).unique()))
gare_depart = st.selectbox("Gare de départ", sorted(df["Gare de départ"].astype(str).unique()))
gare_arrivee = st.selectbox("Gare d'arrivée", sorted(df["Gare d'arrivée"].astype(str).unique()))

mois = st.selectbox("Mois", sorted(df["Month"].unique()))
annee = st.selectbox("Année", sorted(df["Year"].unique()))

nb_circ = st.slider(
    "Nombre de circulations prévues",
    min_value=1,
    max_value=200,
    value=50
)

def build_input():

    row = {}

    target = "Retard moyen de tous les trains à l'arrivée"
    feature_columns = [
        column for column in df.columns
        if column != target and "Retard" not in column
    ]

    medians = df[feature_columns].select_dtypes(include="number").median()

    for column in feature_columns:
        if column in medians.index:
            row[column] = medians[column]
        else:
            row[column] = None

    row["Service"] = service
    row["Gare de départ"] = gare_depart
    row["Gare d'arrivée"] = gare_arrivee
    row["Month"] = mois
    row["Year"] = annee
    row["Nombre de circulations prévues"] = nb_circ

    return pd.DataFrame([row])

if st.button("Prédire le retard"):
    input_df = build_input()
    prediction = model.predict(input_df)[0]
    st.success(f"Retard estimé : **{prediction:.2f} minutes**")

