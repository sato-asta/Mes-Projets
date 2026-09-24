import streamlit as st
import pandas as pd
import numpy as np

st.header("📊 Data dashboard")

df = pd.DataFrame(
    np.random.randn(20, 3),
    columns=['a', 'b', 'c']
)

st.dataframe(df)

st.header("📈 Linear Graph")

st.line_chart(df)