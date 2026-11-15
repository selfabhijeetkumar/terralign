import json

with open('data/analogs.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for s in data:
    print(f"ID: {s['id']}, Name: {s['name']}, Class: {s.get('classification')}, Res: {s.get('demResolutionMeters')}m, Source: {s.get('demSource')}")
