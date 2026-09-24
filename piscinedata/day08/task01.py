from bs4 import BeautifulSoup
import requests
from task00 import *

def get_html(url: str, *, timeout: float = 5.0, retries: int = 2):
    url = normalize_url(url)
    headers = build_headers(None)

    for attempt in range (retries + 1):
        try:
            response = requests.get(url, headers=headers, timeout=timeout)
            response.raise_for_status()
            return BeautifulSoup(response.text, "html.parser")
        except requests.RequestException:
            if attempt == retries:
                raise