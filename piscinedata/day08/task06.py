import os
import requests
from bs4 import BeautifulSoup
from task00 import *

def download_images(url: str, *, output_dir: str = "images") -> int:

    url = normalize_url(url)
    headers = build_headers(None)

    try:
        response = requests.get(url, headers=headers, timeout=5.0)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Error fetching the URL: {e}")
        return 0

    soup = BeautifulSoup(response.text, "html.parser")
    img_tags = soup.find_all("img")

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    count = 0
    for img in img_tags:
        img_url = img.get("src")
        if img_url:
            img_url = normalize_url(img_url)
            try:
                img_response = requests.get(img_url, headers=headers, timeout=5.0)
                img_response.raise_for_status()
                img_tags = img_url.split("/")
                img_name = img_tags[-1] if img_tags[-1] else "image.jpg"
                img_path = os.path.join(output_dir, img_name)
                with open(img_path, "wb") as file:
                    file.write(img_response.content)
                count += 1
            except requests.RequestException as e:
                print(f"Error downloading image {img_url}: {e}")
    return count
