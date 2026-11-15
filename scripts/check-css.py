import urllib.request
import re

# Get the HTML
r = urllib.request.urlopen('http://localhost:3000/terrain')
html = r.read().decode()

# Find CSS link tags
links = re.findall(r'<link[^>]*href=["\']([^"\']*\.css[^"\']*)["\'][^>]*>', html)
print(f"CSS link tags found: {len(links)}")
for l in links:
    print(f"  {l}")

# Find inline styles
styles = re.findall(r'<style[^>]*>(.*?)</style>', html, re.DOTALL)
print(f"\nInline style blocks found: {len(styles)}")
for i, s in enumerate(styles):
    preview = s[:200].replace('\n', ' ').strip()
    print(f"  Style {i}: {preview}...")

# Check if CSS files are accessible
for link in links:
    url = link if link.startswith('http') else f'http://localhost:3000{link}'
    try:
        resp = urllib.request.urlopen(url)
        print(f"\n  CSS {link}: {resp.status}, {len(resp.read())} bytes")
    except Exception as e:
        print(f"\n  CSS {link}: FAILED - {e}")

# Print first 500 chars of HTML for inspection
print(f"\nHTML head (first 2000 chars):")
print(html[:2000])
