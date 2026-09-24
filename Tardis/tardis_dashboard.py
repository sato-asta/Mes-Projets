import streamlit as st
import pandas as pd
import numpy as np

st.set_page_config(
    page_title="Multi-Pages Application ",
    page_icon="🏠"
)
st.title("Welcome to the SNCF Tardis App 🏠")

st.markdown("""
        ### Here you will find all the resources needed to study SNCF data.

        ### Navigation
        Use the sidebar to navigate between the different pages:

        - **Dashboard** (this page) - Introduction and overview

        - **Delay distribution visualization** - Visualize and analyze data.
    """)

st.info("💡Select a page in the sidebar to explore the different features!")
