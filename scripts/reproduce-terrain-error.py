import asyncio
import json
import urllib.request
import websockets
import base64
import os

async def run():
    targets_url = "http://127.0.0.1:9222/json/new?http://localhost:3000/terrain"
    req = urllib.request.Request(targets_url, method="PUT")
    target = json.loads(urllib.request.urlopen(req).read().decode())
    ws_url = target["webSocketDebuggerUrl"]
    print("Connecting to tab:", target["id"])

    async with websockets.connect(ws_url) as ws:
        msg_id = 0
        async def send(method, params=None):
            nonlocal msg_id
            msg_id += 1
            payload = {"id": msg_id, "method": method}
            if params:
                payload["params"] = params
            await ws.send(json.dumps(payload))
            return msg_id

        await send("Page.enable")
        await send("Runtime.enable")
        await send("Console.enable")
        await send("Network.enable")
        await send("Log.enable")

        failed_requests = []
        console_logs = []

        async def listen(duration=4):
            end_time = asyncio.get_event_loop().time() + duration
            while asyncio.get_event_loop().time() < end_time:
                try:
                    res = await asyncio.wait_for(ws.recv(), timeout=0.5)
                    data = json.loads(res)
                    method = data.get("method")
                    params = data.get("params", {})

                    if method == "Network.responseReceived":
                        resp = params.get("response", {})
                        status = resp.get("status")
                        url = resp.get("url")
                        if status >= 400:
                            failed_requests.append((status, url))
                            print(f"[HTTP {status}] {url}")

                    elif method == "Runtime.consoleAPICalled":
                        type_ = params.get("type")
                        args = [str(a.get("value", a.get("description", ""))) for a in params.get("args", [])]
                        console_logs.append((type_, " ".join(args)))
                        print(f"[CONSOLE {type_.upper()}] {' '.join(args)}")

                    elif method == "Runtime.exceptionThrown":
                        details = params.get("exceptionDetails", {})
                        print(f"[RUNTIME EXCEPTION] {details.get('text')}: {details.get('exception', {}).get('description')}")

                except asyncio.TimeoutError:
                    continue

        await listen(5)

        # Extract Next.js Error Overlay details
        extract_script = """
        (() => {
            const portal = document.querySelector('nextjs-portal');
            if (!portal || !portal.shadowRoot) return { found: false };
            const root = portal.shadowRoot;
            
            // Extract text from visible elements, ignoring styles
            const dialog = root.querySelector('[role="dialog"]') || root.querySelector('div');
            const title = root.querySelector('h1, h2, [data-nextjs-dialog-header]')?.innerText;
            const description = root.querySelector('[data-nextjs-dialog-body], pre, code, p')?.innerText;
            const allText = dialog ? dialog.innerText : root.innerText;
            
            return {
                found: true,
                title: title || 'No title element',
                description: description || 'No description element',
                dialogText: allText
            };
        })()
        """
        eval_id = await send("Runtime.evaluate", {"expression": extract_script, "returnByValue": True})
        while True:
            res = await ws.recv()
            data = json.loads(res)
            if data.get("id") == eval_id:
                val = data.get("result", {}).get("result", {}).get("value", {})
                print("\n=== NEXT.JS ERROR OVERLAY DETAILS ===")
                print(json.dumps(val, indent=2))
                break

if __name__ == "__main__":
    asyncio.run(run())
