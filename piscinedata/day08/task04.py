from task01 import get_html

def list_all_links(url: str)-> list[str]:
    soup = get_html(url)
    links = []

    for link_tag in soup.find_all("a", href=True):
        links.append(link_tag["href"])
    return links
