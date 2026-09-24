from task01 import get_html

def scrape_title(url: str) ->str:
    soup = get_html(url)
    title_tag = soup.find("title")

    if title_tag is not None:
        return title_tag.text.strip()
    else:
        return ""
