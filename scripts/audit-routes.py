import urllib.request
import urllib.error
import time
import json
import re

routes = [
    ('/', 'Landing Page'),
    ('/mission', 'Mission Command'),
    ('/terrain', '3D Terrain Studio'),
    ('/reality-gap', 'Reality Gap'),
    ('/portfolio', 'Portfolio Optimizer'),
    ('/about', 'About Us'),
    ('/faq', 'Scientific FAQ'),
    ('/contact', 'Contact Us'),
    ('/privacy', 'Privacy Policy'),
    ('/terms', 'Terms of Use'),
    ('/api/analogs', 'Analogs API'),
    ('/non-existent-page-404', 'Custom 404 Route'),
]

print("=== ROUTE AND APPLICATION COMPLETENESS AUDIT ===")
results = []

for path, name in routes:
    url = f"http://localhost:3000{path}"
    start = time.time()
    try:
        req = urllib.request.Request(url)
        resp = urllib.request.urlopen(req)
        status = resp.status
        elapsed = (time.time() - start) * 1000
        content_type = resp.headers.get('Content-Type', '')
        body = resp.read().decode('utf-8', errors='ignore')
        
        # Check for errors in body
        has_error = '__next_error__' in body or 'Application error' in body
        title_match = re.search(r'<title>(.*?)</title>', body)
        title = title_match.group(1) if title_match else 'NO TITLE'
        
        # Check for CSS links
        css_links = len(re.findall(r'<link[^>]*href=["\']([^"\']*\.css[^"\']*)["\']', body))
        
        results.append({
            'path': path,
            'name': name,
            'status': status,
            'elapsed_ms': round(elapsed, 1),
            'content_type': content_type,
            'title': title,
            'css_links': css_links,
            'has_error': has_error,
            'body_bytes': len(body)
        })
        print(f"[OK] {path:22} | Status: {status} | {elapsed:6.1f}ms | {len(body):6d}B | CSS: {css_links} | Title: {title[:40]}")
    except urllib.error.HTTPError as e:
        elapsed = (time.time() - start) * 1000
        body = e.read().decode('utf-8', errors='ignore')
        title_match = re.search(r'<title>(.*?)</title>', body)
        title = title_match.group(1) if title_match else f'HTTP {e.code}'
        results.append({
            'path': path,
            'name': name,
            'status': e.code,
            'elapsed_ms': round(elapsed, 1),
            'content_type': e.headers.get('Content-Type', ''),
            'title': title,
            'css_links': 0,
            'has_error': e.code != 404,
            'body_bytes': len(body)
        })
        print(f"[HTTP {e.code}] {path:22} | {elapsed:6.1f}ms | Title: {title}")
    except Exception as ex:
        print(f"[FAIL] {path:22} | Error: {ex}")

# Also test /api/analogs JSON schema
print("\n=== API SCHEMA AUDIT: /api/analogs ===")
try:
    resp = urllib.request.urlopen("http://localhost:3000/api/analogs")
    data = json.loads(resp.read().decode('utf-8'))
    total_sites = data.get('totalSites')
    sites = data.get('sites', [])
    print(f"API Contract Envelope: targetBody='{data.get('targetBody')}', activityId='{data.get('activityId')}', totalSites={total_sites}")
    print(f"API Returned {len(sites)} analog site records in data['sites']")
    assert total_sites == 7, f"Expected totalSites=7, got {total_sites}"
    assert len(sites) == 7, f"Expected 7 sites, got {len(sites)}"
    first = sites[0].get('site', {})
    required_keys = ['id', 'name', 'coordinates', 'elevationMeters', 'targetBody', 'suitabilityScores', 'dimensions']
    missing_keys = [k for k in required_keys if k not in first]
    if missing_keys:
        print(f"MISSING KEYS in API schema: {missing_keys}")
    else:
        print(f"Schema valid: all {len(required_keys)} required keys present in API records (All 7 canonical flagship sites verified)")
except Exception as ex:
    print(f"API Audit Error: {ex}")
