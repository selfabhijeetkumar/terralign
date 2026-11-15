import urllib.request
import re

url = "http://localhost:3000/terrain"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req) as resp:
    html = resp.read().decode('utf-8')
    print("Page status:", resp.status)

css_links = re.findall(r'<link[^>]*rel=["\']stylesheet["\'][^>]*href=["\']([^"\']+)["\']', html)
print("CSS links found:", css_links)

for link in css_links:
    css_url = "http://localhost:3000" + link
    css_req = urllib.request.Request(css_url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(css_req) as cresp:
        data = cresp.read()
        print("CSS:", link)
        print("Status:", cresp.status)
        print("Content-Type:", cresp.headers.get("Content-Type"))
        print("Length (bytes):", len(data))
