import urllib.request, re

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}

urls = [
    ('Structured Money', 'https://structured.money/'),
    ('Locomotive Case Study', 'https://locomotive.ca/en/work/structured'),
    ('Obsidian Assembly', 'https://obsidianassembly.com/'),
    ('UNESCO Virtual Museum', 'https://museum.unesco.org/'),
    ('UNESCO Supporting', 'https://www.unesco.org/en/culture-and-digital-technologies/virtual-museum')
]

for name, url in urls:
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            title_m = re.search(r'<title>(.*?)</title>', html, re.I)
            desc_m = re.search(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']', html, re.I)
            has_canvas = bool(re.search(r'<canvas|three|webgl', html, re.I))
            print(f"=== {name} ({url}) ===")
            print("Status:", resp.status)
            print("Title:", title_m.group(1).strip() if title_m else "None")
            print("Description:", desc_m.group(1).strip() if desc_m else "None")
            print("Has WebGL/Canvas mentions:", has_canvas)
            print("HTML Length:", len(html))
            print()
    except Exception as e:
        print(f"Error fetching {name}: {e}")

