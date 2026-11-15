import json

analogs = json.load(open('data/analogs.json', 'r', encoding='utf-8'))
print(f"Total sites: {len(analogs)}")
for a in analogs:
    coords = a['coordinates']
    citations = len(a.get('literatureCitations', []))
    print(f"ID: {a['id']:22} | Lat: {coords['lat']:8.4f}, Lng: {coords['lng']:9.4f} | Elev: {a['elevationMeters']:5d}m | Target: {a['targetBody']:5} | DEM: {a.get('demResolutionMeters')}m ({a.get('demSource')[:30]}) | Citations: {citations}")
