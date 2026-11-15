import urllib.request, re

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}

def analyze_site(name, url):
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            print(f"================ {name} ================")
            # Look for css variables
            colors = set(re.findall(r'--(?:color|bg|text|font|accent)[\w-]*:\s*[^;]+', html, re.I))
            print("CSS Variables:", list(colors)[:10])
            # Look for typography classes / headings
            headings = re.findall(r'<h[1-3][^>]*>(.*?)</h[1-3]>', html, re.I | re.DOTALL)
            clean_headings = [re.sub(r'<[^>]+>', '', h).strip() for h in headings if h.strip()]
            print("Headings:", clean_headings[:8])
            # Look for navigation links
            nav = re.findall(r'<nav[^>]*>(.*?)</nav>', html, re.I | re.DOTALL)
            if nav:
                links = re.findall(r'<a[^>]*>(.*?)</a>', nav[0], re.I | re.DOTALL)
                print("Nav links:", [re.sub(r'<[^>]+>', '', l).strip() for l in links if l.strip()][:8])
            # Key section classes or data attributes
            data_attrs = set(re.findall(r'data-[\w-]+', html))
            print("Data attributes:", list(data_attrs)[:8])
    except Exception as e:
        print(f"Error {name}: {e}")

analyze_site("Obsidian Assembly", "https://obsidianassembly.com/")
analyze_site("UNESCO Museum", "https://museum.unesco.org/")

