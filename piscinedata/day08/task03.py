from task01 import get_html

def scrape_paragraph(url: str) -> str:
    soup = get_html(url)

    for paragraph in soup.find_all("p"):
        if paragraph.get_text(strip=True):
            return str(paragraph)
    return ""
