def build_headers(user_agent: str | None = None) -> dict:

    if user_agent is None:
        user_agent = "EpitechDataBootcamp/1.0 (+https://epitech.eu)"

    return {"User-Agent": user_agent}

def normalize_url(url: str)-> str:
    url = url.strip()

    if not url.startswith("http://") and not url.startswith("https://"):
        url = "http://" + url
    return url
