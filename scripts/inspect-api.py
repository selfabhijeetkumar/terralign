import urllib.request
import json

resp = urllib.request.urlopen('http://localhost:3000/api/analogs')
data = json.loads(resp.read().decode('utf-8'))

print('Top-level keys in response:', list(data.keys()))
print('totalSites field:', data.get('totalSites'))
sites = data.get('sites', [])
print('Actual count of sites in data["sites"]:', len(sites))
for i, s in enumerate(sites):
    site_obj = s['site']
    print(f"  [{i+1}] ID: {site_obj['id']:22} | Score: {s['score']} | Name: {site_obj['name'][:40]}")
