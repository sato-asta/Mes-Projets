import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("cleaned_dataset.csv", sep=";")

st.title("Summary Statistics Panel")

available_columns = [col for col in df.columns if col != "Year"]
selected_column = st.selectbox("Select metric to display", available_columns, format_func=lambda x: x.replace("_", " "))

year_min = int(df["Year"].min())
year_max = int(df["Year"].max())
selected_year = st.slider("Select year range", year_min, year_max, (year_min, year_max))

filtered_data = df[(df["Year"] >= selected_year[0]) & (df["Year"] <= selected_year[1])]

st.subheader(f"{selected_column.replace('_', ' ')}")
st.line_chart(filtered_data.set_index("Year")[selected_column])

st.subheader("Data Table")
st.dataframe(filtered_data.style.format({"Average_Home_Price": "{:.0f}", "Median_Income": "{:.0f}", "Interest_Rate": "{:.1f}"}))