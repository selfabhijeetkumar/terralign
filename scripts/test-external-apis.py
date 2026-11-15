import urllib.request
import urllib.error
import json
import socket

socket.setdefaulttimeout(12)

endpoints = [
    ("USGS EPQS v1", "https://epqs.nationalmap.gov/v1/json?x=-111.5049&y=35.3071&wkid=4326&units=Meters"),
    ("USGS 3DEP ImageServer Identify", "https://elevation.nationalmap.gov/arcgis/rest/services/3DEPElevation/ImageServer/identify?geometry=%7B%22x%22%3A-111.5049%2C%22y%22%3A35.3071%7D&geometryType=esriGeometryPoint&returnGeometry=false&f=json"),
    ("Open-Elevation API", "https://api.open-elevation.com/api/v1/lookup?locations=35.3071,-111.5049"),
    ("NASA PDS ODE Moon", "https://oderest.rsl.wustl.edu/live2/?target=moon&query=product&ptype=LDEM&maxresults=1&output=JSON"),
    ("NASA PDS ODE Mars", "https://oderest.rsl.wustl.edu/live2/?target=mars&query=product&ptype=MEGDR&maxresults=1&output=JSON"),
    ("USGS Astrogeology Search", "https://astrogeology.usgs.gov/search/api/v1/datasets?target=Moon"),
]

headers = {'User-Agent': 'TERRALIGN/1.0 (NASA Space Apps Challenge; Scientific Research Prototype)'}

for name, url in endpoints:
    print(f"Testing [{name}] -> {url[:70]}...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp:
            status = resp.status
            content = resp.read()
            print(f"  --> HTTP {status} | Received {len(content)} bytes")
            try:
                data = json.loads(content.decode('utf-8'))
                keys = list(data.keys()) if isinstance(data, dict) else f"list({len(data)})"
                print(f"      Keys/Structure: {keys}")
                # Print sample
                preview = json.dumps(data)[:200]
                print(f"      Sample: {preview}...")
            except Exception as pe:
                print(f"      Non-JSON preview: {content[:100]}")
    except Exception as e:
        print(f"  --> FAILED: {e}")
