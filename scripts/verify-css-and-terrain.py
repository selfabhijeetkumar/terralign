import asyncio
import json
import urllib.request
import websockets
import base64
import os

async def verify():
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
        await send("Emulation.setDeviceMetricsOverride", {
            "width": 1440,
            "height": 900,
            "deviceScaleFactor": 1,
            "mobile": False
        })

        network_requests = []
        css_requests = []
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
                        mime = resp.get("mimeType")
                        if "css" in url or mime == "text/css":
                            css_requests.append({"url": url, "status": status, "mime": mime})
                        if status >= 400:
                            print(f"[HTTP {status}] {url}")

                    elif method == "Runtime.consoleAPICalled":
                        type_ = params.get("type")
                        args = [str(a.get("value", a.get("description", ""))) for a in params.get("args", [])]
                        print(f"[{type_.upper()}] {' '.join(args)}")

                    elif method == "Runtime.exceptionThrown":
                        details = params.get("exceptionDetails", {})
                        desc = details.get("exception", {}).get("description") or details.get("text")
                        print(f"[RUNTIME EXCEPTION] {desc}")

                except asyncio.TimeoutError:
                    continue

        print("=== Monitoring Navigation & Network (5s) ===")
        await listen(5)

        print("\n=== CSS Network Requests ===")
        print(json.dumps(css_requests, indent=2))

        # Inspect computed styles & layout elements
        inspect_script = """
        (() => {
            const bodyStyle = window.getComputedStyle(document.body);
            const header = document.querySelector('header');
            const headerStyle = header ? window.getComputedStyle(header) : null;
            const skipLink = document.querySelector('a[href="#main-content"]');
            const skipStyle = skipLink ? window.getComputedStyle(skipLink) : null;
            const brandSpan = document.querySelector('header span.font-display') || document.querySelector('header a span');
            const brandStyle = brandSpan ? window.getComputedStyle(brandSpan) : null;
            
            // Inspect SVGs
            const svgs = Array.from(document.querySelectorAll('svg')).map(s => {
                const rect = s.getBoundingClientRect();
                return {
                    width: rect.width,
                    height: rect.height,
                    className: s.getAttribute('class'),
                    parentTag: s.parentElement ? s.parentElement.tagName : null
                };
            });

            // Inspect Canvases
            const canvases = Array.from(document.querySelectorAll('canvas')).map(c => {
                const rect = c.getBoundingClientRect();
                return {
                    canvasWidth: c.width,
                    canvasHeight: c.height,
                    clientWidth: rect.width,
                    clientHeight: rect.height
                };
            });

            return {
                body: {
                    bgColor: bodyStyle.backgroundColor,
                    color: bodyStyle.color,
                    fontFamily: bodyStyle.fontFamily
                },
                header: headerStyle ? {
                    height: headerStyle.height,
                    bgColor: headerStyle.backgroundColor
                } : null,
                skipLink: skipStyle ? {
                    position: skipStyle.position,
                    clip: skipStyle.clip,
                    width: skipStyle.width,
                    height: skipStyle.height
                } : null,
                brandColor: brandStyle ? brandStyle.color : null,
                svgCount: svgs.length,
                svgs: svgs.slice(0, 8),
                canvasCount: canvases.length,
                canvases
            };
        })()
        """
        eval_id = await send("Runtime.evaluate", {"expression": inspect_script, "returnByValue": True})
        while True:
            res = await ws.recv()
            data = json.loads(res)
            if data.get("id") == eval_id:
                val = data.get("result", {}).get("result", {}).get("value", {})
                print("\n=== COMPUTED STYLES & ELEMENT INSPECTION ===")
                print(json.dumps(val, indent=2))
                break

        # Capture high-res screenshot
        shot_id = await send("Page.captureScreenshot", {"format": "png"})
        while True:
            res = await ws.recv()
            data = json.loads(res)
            if data.get("id") == shot_id:
                b64_data = data.get("result", {}).get("data")
                out_path = os.path.abspath("docs/design/screenshots/after/debug-terrain-recovery.png")
                os.makedirs(os.path.dirname(out_path), exist_ok=True)
                with open(out_path, "wb") as f:
                    f.write(base64.b64decode(b64_data))
                print(f"\nSaved recovery screenshot to: {out_path} ({len(b64_data)} bytes base64)")
                break

if __name__ == "__main__":
    asyncio.run(verify())
