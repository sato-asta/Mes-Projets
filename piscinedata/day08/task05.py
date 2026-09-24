from task01 import get_html

def count_paragraph_links(url: str) -> int:
    soup = get_html(url)
    count = 0

    for paragraph in soup.find_all("p"):
        if paragraph.text.strip():
            count += len(paragraph.find_all("a", href=True))
    return count
