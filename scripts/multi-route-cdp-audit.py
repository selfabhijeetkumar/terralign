import subprocess
import time
import json
import urllib.request
import asyncio
import websockets

async def check_route(route, port=9225):
    proc = subprocess.Popen([
        r'C:\Program Files\Google\Chrome\Application\chrome.exe',
        f'--remote-debugging-port={port}',
        '--headless=new',
        '--use-gl=angle',
        '--use-angle=d3d11',
        '--no-sandbox',
        '--disable-extensions',
        f'http://localhost:3000{route}'
    ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    await asyncio.sleep(4)
    errors = []
    warnings = []

    try:
        resp = urllib.request.urlopen(f'http://localhost:{port}/json')
        targets = json.loads(resp.read().decode())
        page_target = next((t for t in targets if t.get('type') == 'page'), None)
        if not page_target:
            print(f"[{route}] No page target found")
            return []

        ws_url = page_target['webSocketDebuggerUrl']
        async with websockets.connect(ws_url) as ws:
            await ws.send(json.dumps({'id': 1, 'method': 'Console.enable'}))
            await ws.send(json.dumps({'id': 2, 'method': 'Runtime.enable'}))
            await ws.send(json.dumps({'id': 3, 'method': 'Page.enable'}))

            end_time = time.time() + 3.0
            while time.time() < end_time:
                try:
                    msg_str = await asyncio.wait_for(ws.recv(), timeout=0.5)
                    msg = json.loads(msg_str)
                    method = msg.get('method', '')
                    if method == 'Runtime.consoleAPICalled':
                        params = msg.get('params', {})
                        msg_type = params.get('type', '')
                        args = [str(a.get('value', a.get('description', ''))) for a in params.get('args', [])]
                        text = ' '.join(args)
                        if msg_type in ('error', 'assert'):
                            errors.append(text)
                        elif msg_type == 'warning':
                            warnings.append(text)
                    elif method == 'Runtime.exceptionThrown':
                        details = msg.get('params', {}).get('exceptionDetails', {})
                        errors.append(details.get('text', '') + ': ' + str(details.get('exception', {}).get('description', '')))
                except asyncio.TimeoutError:
                    pass

        print(f"Route: {route:<15} | Errors: {len(errors)} | Warnings: {len(warnings)}")
        for e in errors:
            print(f"   [ERR] {e}")
        for w in warnings:
            print(f"   [WRN] {w}")
    except Exception as ex:
        print(f"[{route}] CDP audit failed: {ex}")
    finally:
        proc.terminate()
        proc.wait()

async def main():
    routes = ['/', '/mission', '/terrain', '/reality-gap', '/portfolio', '/about']
    for r in routes:
        await check_route(r, port=9226)
        await asyncio.sleep(1)

asyncio.run(main())
