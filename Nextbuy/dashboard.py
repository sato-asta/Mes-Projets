import streamlit as st
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import os
import joblib

st.set_page_config(page_title="Instacart: Data Analysis", layout="wide")
st.title("Instacart : Prediction and Analysis of Reorders")

st.markdown("---")

@st.cache_data
def load_data():
    return pd.read_csv("cleaned_dataset_final.csv").dropna()

df = load_data()

# -----------------------------
# LOAD REORDER MODELS
# -----------------------------
@st.cache_resource
def load_models():
    models = {}

    model_files = {
        "Logistic Regression": "model_logistic_regression.pkl",
        "Gradient Boosting": "model_gradient_boosting.pkl"
    }

    for name, file in model_files.items():
        if os.path.exists(file):
            try:
                models[name] = joblib.load(file)
            except Exception as e:
                st.warning(f"Error loading {file}: {e}")

    return models


# -----------------------------
# LOAD BASKET SIZE MODELS
# -----------------------------
@st.cache_resource
def load_basket_models():
    models = {}

    model_files = {
        "Random Forest": "model_random_forest.pkl", 
        "Linear Regression": "model_linear_regression.pkl"

    }

    for name, file in model_files.items():
        if os.path.exists(file):
            try:
                models[name] = joblib.load(file)
            except Exception as e:
                st.warning(f"Error loading {file}: {e}")

    return models


models = load_models()
model_loaded = len(models) > 0

basket_models = load_basket_models()
basket_models_loaded = len(basket_models) > 0


# -----------------------------
# GLOBAL STATS
# -----------------------------
st.header("Global Statistics")

col1, col2, col3, col4, col5 = st.columns(5)

with col1:
    st.metric("Total Rows", len(df))

with col2:
    st.metric("Average Order Hour", f"{round(df['order_hour_of_day'].mean(),2)} h")

with col3:
    st.metric("Avg Days Since Prior", f"{round(df['days_since_prior_order'].mean(),2)} days")

with col4:
    st.metric("Max Order Number", int(df["order_number"].max()))

with col5:
    st.metric("Reorder Ratio", f"{round(df['reordered'].mean()*100,2)} %")

st.markdown("---")

# -----------------------------
# ORDER ANALYSIS
# -----------------------------
st.header("Order Analysis")

dept = st.selectbox(
    "Select a department:",
    ["All departments"] + list(df["department"].unique()),
    key="dept_select"
)

if dept != "All departments":
    df_filtered = df[df["department"] == dept]
else:
    df_filtered = df

fig1, ax1 = plt.subplots(figsize=(10,5))
sns.histplot(df_filtered["order_hour_of_day"], bins=24, kde=True, ax=ax1)
ax1.set_title(f"Order Hour Distribution - {dept}")

fig2, ax2 = plt.subplots(figsize=(10,5))
sns.histplot(df_filtered["days_since_prior_order"], bins=30, kde=True, ax=ax2)
ax2.set_title(f"Days Since Prior Order Distribution - {dept}")

col1, col2 = st.columns(2)

with col1:
    st.pyplot(fig1)

with col2:
    st.pyplot(fig2)

st.markdown("---")

# -----------------------------
# REORDER PREDICTION
# -----------------------------
st.header("Predict Reorder Probability")

if model_loaded:

    model_choice = st.selectbox(
        "Select prediction model",
        list(models.keys()),
        key="reorder_model"
    )

    col_a, col_b, col_c = st.columns(3)

    with col_a:
        input_user = st.number_input("User ID", min_value=1, value=1, key="user_id")
        input_order_num = st.number_input("Order Number", min_value=1, value=5, key="order_number")
        input_dow = st.number_input("Day of Week (0-6)", min_value=0.0, max_value=6.0, value=3.0, key="order_dow")
        input_hour = st.number_input("Hour of Day (0-23)", min_value=0.0, max_value=23.0, value=12.0, key="order_hour")

    with col_b:
        input_days_prior = st.number_input("Days since prior order", min_value=0.0, value=7.0, key="days_prior")
        input_prod_id = st.number_input("Product ID", min_value=1, value=1, key="product_id")
        input_prod_name = st.selectbox("Product Name", df["product_name"].unique(), key="product_name")

    with col_c:
        input_aisle = st.selectbox("Aisle", df["aisle"].unique(), key="aisle")
        input_dept = st.selectbox("Department", df["department"].unique(), key="department")
        input_add_cart = st.number_input("Add to cart order", min_value=1.0, value=1.0, key="add_to_cart")

    if st.button("Predict Reorder", key="predict_reorder"):

        model = models[model_choice]

        dict_encodage = {"product_name":{}, "aisle":{}, "department":{}}

        for idx,val in enumerate(df["product_name"].unique(),1):
            dict_encodage["product_name"][val]=idx

        for idx,val in enumerate(df["aisle"].unique(),1):
            dict_encodage["aisle"][val]=idx

        for idx,val in enumerate(df["department"].unique(),1):
            dict_encodage["department"][val]=idx

        df_encoded = df.sample(10000, random_state=42).copy()
        df_encoded.replace(dict_encodage, inplace=True)

        features = [
            "user_id","order_number","order_dow","order_hour_of_day",
            "days_since_prior_order","product_id","product_name",
            "aisle","department","add_to_cart_order"
        ]

        X = df_encoded[features]

        X_train, X_test = train_test_split(X, test_size=0.3, random_state=0)

        scaler = StandardScaler()
        scaler.fit(X_train)

        model_input = pd.DataFrame([{
            "user_id":input_user,
            "order_number":input_order_num,
            "order_dow":input_dow,
            "order_hour_of_day":input_hour,
            "days_since_prior_order":input_days_prior,
            "product_id":input_prod_id,
            "product_name":dict_encodage["product_name"].get(input_prod_name,0),
            "aisle":dict_encodage["aisle"].get(input_aisle,0),
            "department":dict_encodage["department"].get(input_dept,0),
            "add_to_cart_order":input_add_cart
        }])

        model_input_scaled = scaler.transform(model_input)

        prediction = model.predict(model_input_scaled)

        if prediction[0] == 1:
            st.success("Product will likely be REORDERED")
        else:
            st.warning("Product will likely NOT be reordered")

else:
    st.error("No reorder model found")

st.markdown("---")

# -----------------------------
# BASKET SIZE PREDICTION
# -----------------------------
st.header("Predict Basket Size")

if basket_models_loaded:

    basket_model_choice = st.selectbox(
        "Select basket size model",
        list(basket_models.keys()),
        key="basket_model"
    )

    col1, col2, col3 = st.columns(3)

    with col1:
        basket_dow = st.number_input("Day of week (0-6)",0,6,3,key="basket_dow")

    with col2:
        basket_hour = st.number_input("Order hour (0-23)",0,23,12,key="basket_hour")

    with col3:
        basket_days = st.number_input("Days since prior order",0.0,30.0,7.0,key="basket_days")

    if st.button("Predict Basket Size", key="predict_basket"):

        basket_model = basket_models[basket_model_choice]

        basket_input = pd.DataFrame([{
            "order_dow": basket_dow,
            "order_hour_of_day": basket_hour,
            "days_since_prior_order": basket_days
        }])

        prediction = basket_model.predict(basket_input)

        size = round(prediction[0],2)

        st.success(f"Estimated basket size: **{round(size)} products**")

else:
    st.warning("No basket size model found.")