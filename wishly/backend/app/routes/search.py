import os
import requests
from fastapi import APIRouter, Query
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

SERP_API_KEY = os.getenv("SERP_API_KEY", "").strip()
SERP_URL = "https://serpapi.com/search"


@router.get("/search")
def search(q: str = Query(..., min_length=1)):
    """Queries Google Shopping via SerpAPI and returns structured product results."""
    if not SERP_API_KEY:
        return {"results": [], "error": "SerpAPI non configurée"}

    params = {
        "engine": "google_shopping",
        "q": q,
        "api_key": SERP_API_KEY,
        "hl": "fr",
        "gl": "fr",
        "num": 8,
    }

    try:
        response = requests.get(SERP_URL, params=params, timeout=10)
        response.raise_for_status()
        raw = response.json()
    except Exception as e:
        print(f"Error calling SerpAPI for query '{q}': {e}")
        return {"results": [], "error": "Search service unavailable"}

    results = []
    for item in raw.get("shopping_results", []):
        results.append({
            "title": item.get("title", ""),
            "url": item.get("product_link", ""),
            "thumbnail": item.get("thumbnail", ""),
            "source": item.get("source", ""),
            "snippet": item.get("price", ""),
        })

    return {"results": results}
