import urllib.request
import re

r = urllib.request.urlopen('http://localhost:3000/terrain')
html = r.read().decode()

body_start = html.find('<body')
body_end = html.find('</body>') + 7
if body_start >= 0 and body_end >= 0:
    body = html[body_start:body_end]
    print(f'Body length: {len(body)}')
    has_terrain = 'TERRESTRIAL ANALOG' in body
    has_lunar = 'LUNAR REFERENCE' in body
    has_nav = 'TERRALIGN' in body
    has_skip = 'Skip to main content' in body
    svg_count = body.lower().count('<svg')
    print(f'Has Terrain: {has_terrain}')
    print(f'Has Lunar: {has_lunar}')  
    print(f'Has Nav: {has_nav}')
    print(f'Has Skip link: {has_skip}')
    print(f'SVG count: {svg_count}')

css_links = re.findall(r'href="([^"]*\.css[^"]*)"', html)
print(f'CSS links: {css_links}')

# Check for any Next.js error boundary markers
has_error = '__next_error__' in html or 'error-boundary' in html.lower()
print(f'Has error markers: {has_error}')

# Check the logo SVG
logo_svgs = re.findall(r'<svg[^>]*>(.*?)</svg>', body[:5000], re.DOTALL)
print(f'\nLogo SVGs in first 5000 chars: {len(logo_svgs)}')
for i, svg in enumerate(logo_svgs):
    print(f'  SVG {i}: {len(svg)} chars, starts with: {svg[:100]}')
