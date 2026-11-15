import subprocess
import os

CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
OUT_DIR = r'C:\NASA SPACE HACKATHON\docs\design\screenshots\provenance-consistency'

os.makedirs(OUT_DIR, exist_ok=True)

def capture(url, filename, width=1440, height=900, virtual_time=4000):
    filepath = os.path.join(OUT_DIR, filename)
    cmd = [
        CHROME,
        '--headless=new',
        '--use-gl=angle',
        '--use-angle=d3d11',
        '--no-sandbox',
        f'--window-size={width},{height}',
        f'--virtual-time-budget={virtual_time}',
        f'--screenshot={filepath}',
        url
    ]
    try:
        subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=25)
        size = os.path.getsize(filepath) if os.path.exists(filepath) else 0
        print(f"[OK] {filename:45} ({width}x{height}) -> {size/1024:.1f} KB")
        return True
    except Exception as e:
        print(f"[ERR] {filename:45} -> {e}")
        return False

print("=== CAPTURING PROVENANCE VERIFICATION SCREENSHOTS ===")
capture('http://localhost:3000/', 'landing-provenance-1440x900.png', 1440, 900, 4000)
capture('http://localhost:3000/mission', 'mission-command-provenance-1440x900.png', 1440, 900, 5000)
capture('http://localhost:3000/terrain', 'terrain-studio-provenance-1440x900.png', 1440, 900, 5000)
capture('http://localhost:3000/portfolio', 'portfolio-provenance-1440x900.png', 1440, 900, 4000)
