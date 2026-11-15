"""Check for JS errors on /terrain via CDP"""
import json
import subprocess
import time
import urllib.request
import socket

def find_free_port():
    with socket.socket() as s:
        s.bind(('', 0))
        return s.getsockname()[1]

port = 9334

# Launch Chrome with remote debugging
chrome = subprocess.Popen([
    r'C:\Program Files\Google\Chrome\Application\chrome.exe',
    f'--remote-debugging-port={port}',
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    '--user-data-dir=C:/temp/chrome-debug-css',
    '--window-size=1440,900',
    'http://localhost:3000/terrain'
], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

time.sleep(8)  # Wait for page to load

try:
    # Get the debugging endpoint
    resp = urllib.request.urlopen(f'http://localhost:{port}/json')
    tabs = json.loads(resp.read())
    print(f"Found {len(tabs)} tabs")
    
    if tabs:
        ws_url = tabs[0].get('webSocketDebuggerUrl', '')
        print(f"WebSocket URL: {ws_url}")
        print(f"Tab URL: {tabs[0].get('url', '')}")
        print(f"Tab Title: {tabs[0].get('title', '')}")
    
    # Use the /json/protocol to check if we can get console messages
    # Actually let's use a simpler approach - fetch the page HTML from the dev tools
    for tab in tabs:
        print(f"\n--- Tab: {tab.get('title', 'unknown')} ---")
        print(f"URL: {tab.get('url', '')}")
    
except Exception as e:
    print(f"Error: {e}")
finally:
    chrome.terminate()
    chrome.wait(timeout=5)
    print("\nChrome terminated")
