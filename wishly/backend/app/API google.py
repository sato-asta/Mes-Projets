"""
POC - Google Custom Search API
================================
Prérequis :
  pip install requests

Configuration :
  Remplace API_KEY et SEARCH_ENGINE_ID par tes propres valeurs.
  - Clé API       : https://console.developers.google.com
  - Search Engine : https://programmablesearchengine.google.com
"""

import os
import requests
import json
from typing import Optional

# ── Configuration ──────────────────────────────────────────────────────────────
BASE_URL = "https://www.googleapis.com/customsearch/v1"


# ── Client de recherche ────────────────────────────────────────────────────────
class GoogleSearchClient:
    """Client simple pour l'API Google Custom Search."""

    def __init__(self, api_key: str, search_engine_id: str):
        self.api_key = api_key
        self.cx = search_engine_id

    def search(
        self,
        query: str,
        num_results: int = 10,
        language: str = "fr",
        start: int = 1,
        site_restrict: Optional[str] = None,
    ) -> dict:
        """
        Lance une recherche Google.

        Args:
            query          : Terme de recherche
            num_results    : Nombre de résultats (max 10 par requête)
            language       : Code langue, ex. 'fr', 'en'
            start          : Index du premier résultat (pagination)
            site_restrict  : Restreindre à un domaine, ex. 'wikipedia.org'

        Returns:
            Dictionnaire avec les résultats parsés
        """
        params = {
            "key": self.api_key,
            "cx": self.cx,
            "q": query,
            "num": min(num_results, 10),  # max 10 par appel API
            "hl": language,
            "start": start,
        }

        if site_restrict:
            params["q"] += f" site:{site_restrict}"

        response = requests.get(BASE_URL, params=params, timeout=10)
        response.raise_for_status()

        raw = response.json()
        return self._parse_results(raw, query)

    def _parse_results(self, raw: dict, query: str) -> dict:
        """Extrait les infos utiles de la réponse brute."""
        search_info = raw.get("searchInformation", {})
        items = raw.get("items", [])

        results = []
        for item in items:
            results.append({
                "title":   item.get("title", ""),
                "url":     item.get("link", ""),
                "snippet": item.get("snippet", ""),
                "source":  item.get("displayLink", ""),
            })

        return {
            "query":        query,
            "total_results": search_info.get("formattedTotalResults", "0"),
            "search_time":  search_info.get("formattedSearchTime", "0"),
            "results":      results,
        }

    def search_news(self, query: str, num_results: int = 5) -> dict:
        """Recherche orientée actualités."""
        return self.search(query + " actualité", num_results=num_results)

    def search_images_info(self, query: str, num_results: int = 5) -> dict:
        """Recherche d'images (métadonnées uniquement)."""
        params = {
            "key": self.api_key,
            "cx": self.cx,
            "q": query,
            "searchType": "image",
            "num": min(num_results, 10),
        }
        response = requests.get(BASE_URL, params=params, timeout=10)
        response.raise_for_status()
        raw = response.json()

        images = []
        for item in raw.get("items", []):
            img = item.get("image", {})
            images.append({
                "title":     item.get("title", ""),
                "url":       item.get("link", ""),
                "thumbnail": img.get("thumbnailLink", ""),
                "source":    item.get("displayLink", ""),
            })
        return {"query": query, "images": images}


# ── Affichage ──────────────────────────────────────────────────────────────────
def print_results(data: dict) -> None:
    """Affiche les résultats de façon lisible."""
    print(f"\n{'═' * 60}")
    print(f"  Recherche : « {data['query']} »")
    print(f"  Résultats : ~{data['total_results']}  |  Temps : {data['search_time']}s")
    print(f"{'═' * 60}\n")

    for i, r in enumerate(data["results"], 1):
        print(f"[{i}] {r['title']}")
        print(f"    {r['url']}")
        print(f"    {r['snippet'][:120]}...")
        print()

