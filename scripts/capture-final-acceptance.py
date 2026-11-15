import subprocess
import time
import os

CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
OUT_DIR = r'C:\NASA SPACE HACKATHON\docs\design\screenshots\final-acceptance'

os.makedirs(OUT_DIR, exist_ok=True)

def capture(url, filename, width=1440, height=900, virtual_time=5000):
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

# 1. Desktop Primary (1440x900) - All Routes
print("=== 1. CAPTURING DESKTOP 1440x900 ALL ROUTES ===")
capture('http://localhost:3000/', '01-landing-1440x900.png', 1440, 900, 4000)
capture('http://localhost:3000/mission', '02-mission-command-1440x900.png', 1440, 900, 6000)
capture('http://localhost:3000/terrain', '03-terrain-studio-1440x900.png', 1440, 900, 6000)
capture('http://localhost:3000/reality-gap', '04-reality-gap-1440x900.png', 1440, 900, 4000)
capture('http://localhost:3000/portfolio', '05-portfolio-optimizer-1440x900.png', 1440, 900, 4000)
capture('http://localhost:3000/about', '06-about-1440x900.png', 1440, 900, 3000)
capture('http://localhost:3000/faq', '07-faq-1440x900.png', 1440, 900, 3000)
capture('http://localhost:3000/contact', '08-contact-1440x900.png', 1440, 900, 3000)
capture('http://localhost:3000/privacy', '09-privacy-1440x900.png', 1440, 900, 3000)
capture('http://localhost:3000/terms', '10-terms-1440x900.png', 1440, 900, 3000)
capture('http://localhost:3000/invalid-route-404-check', '11-custom-404-1440x900.png', 1440, 900, 3000)

# 2. Laptop Secondary (1280x800)
print("\n=== 2. CAPTURING LAPTOP 1280x800 ===")
capture('http://localhost:3000/', '01-landing-1280x800.png', 1280, 800, 4000)
capture('http://localhost:3000/mission', '02-mission-command-1280x800.png', 1280, 800, 5000)
capture('http://localhost:3000/terrain', '03-terrain-studio-1280x800.png', 1280, 800, 5000)
capture('http://localhost:3000/reality-gap', '04-reality-gap-1280x800.png', 1280, 800, 3000)
capture('http://localhost:3000/portfolio', '05-portfolio-optimizer-1280x800.png', 1280, 800, 3000)

# 3. Mobile Portrait (390x844 - iPhone 14)
print("\n=== 3. CAPTURING MOBILE 390x844 ===")
capture('http://localhost:3000/', '01-landing-390x844.png', 390, 844, 4000)
capture('http://localhost:3000/mission', '02-mission-command-390x844.png', 390, 844, 4000)
capture('http://localhost:3000/terrain', '03-terrain-studio-390x844.png', 390, 844, 5000)
capture('http://localhost:3000/reality-gap', '04-reality-gap-390x844.png', 390, 844, 3000)
capture('http://localhost:3000/portfolio', '05-portfolio-optimizer-390x844.png', 390, 844, 3000)

# 4. Narrow Mobile (360x740 - Galaxy S8/S9 / small Android)
print("\n=== 4. CAPTURING NARROW MOBILE 360x740 ===")
capture('http://localhost:3000/', '01-landing-360x740.png', 360, 740, 4000)
capture('http://localhost:3000/terrain', '03-terrain-studio-360x740.png', 360, 740, 5000)
capture('http://localhost:3000/reality-gap', '04-reality-gap-360x740.png', 360, 740, 3000)

print("\n=== ALL CAPTURES COMPLETE ===")
