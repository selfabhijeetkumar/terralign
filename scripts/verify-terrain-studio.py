import asyncio
import json
import urllib.request
import websockets
import base64
import os
import sys

async def verify():
    port = sys.argv[1] if len(sys.argv) > 1 else "3000"
    base_url = f"http://localhost:{port}/terrain"
    print(f"Testing target: {base_url}")
    targets_url = f"http://127.0.0.1:9222/json/new?{base_url}"
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

        console_events = []
        errors = []

        async def listen(duration=4):
            end_time = asyncio.get_event_loop().time() + duration
            while asyncio.get_event_loop().time() < end_time:
                try:
                    res = await asyncio.wait_for(ws.recv(), timeout=0.5)
                    data = json.loads(res)
                    method = data.get("method")
                    params = data.get("params", {})

                    if method == "Runtime.consoleAPICalled":
                        type_ = params.get("type")
                        args = [str(a.get("value", a.get("description", ""))) for a in params.get("args", [])]
                        msg = f"[{type_.upper()}] " + " ".join(args)
                        console_events.append(msg)
                        print(msg)
                        if type_ in ["error", "assert"]:
                            errors.append(msg)

                    elif method == "Runtime.exceptionThrown":
                        details = params.get("exceptionDetails", {})
                        desc = details.get("exception", {}).get("description") or details.get("text")
                        msg = f"[RUNTIME EXCEPTION] {desc}"
                        errors.append(msg)
                        print(msg)

                except asyncio.TimeoutError:
                    continue

        print("=== Initial Load Monitoring (5s) ===")
        await listen(5)

        # Inspect DOM & WebGL canvases
        dom_script = """
        (() => {
            const canvases = Array.from(document.querySelectorAll('canvas')).map(c => ({
                width: c.width,
                height: c.height,
                styleWidth: c.style.width,
                styleHeight: c.style.height,
                ariaLabel: c.getAttribute('aria-label')
            }));
            const heading = document.querySelector('h1')?.innerText || document.querySelector('h2')?.innerText;
            const siteSelector = document.querySelector('select')?.value || 'no-select';
            const buttons = Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim()).filter(Boolean);
            const overlay = document.querySelector('nextjs-portal');
            const overlayContent = overlay && overlay.shadowRoot ? overlay.shadowRoot.innerHTML : null;
            const hasErrorInOverlay = overlayContent && (overlayContent.includes('Runtime Error') || overlayContent.includes('Unhandled Runtime Error'));

            return {
                heading,
                canvasCount: canvases.length,
                canvases,
                siteSelector,
                buttonCount: buttons.length,
                sampleButtons: buttons.slice(0, 10),
                hasErrorInOverlay
            };
        })()
        """
        eval_id = await send("Runtime.evaluate", {"expression": dom_script, "returnByValue": True})
        while True:
            res = await ws.recv()
            data = json.loads(res)
            if data.get("id") == eval_id:
                val = data.get("result", {}).get("result", {}).get("value", {})
                print("\n=== DOM & CANVAS INSPECTION ===")
                print(json.dumps(val, indent=2))
                break

        # Simulate user interaction: adjust sun elevation slider, toggle camera sync button
        interaction_script = """
        (() => {
            // Find sun slider input if present
            const inputs = Array.from(document.querySelectorAll('input[type="range"]'));
            const inputDetails = inputs.map(i => ({ min: i.min, max: i.max, value: i.value }));
            if (inputs.length > 0) {
                inputs[0].value = 45;
                inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
                inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
            }
            // Find camera sync button or sync toggles
            const syncBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Sync') || b.innerText.includes('Synchronize'));
            if (syncBtn) {
                syncBtn.click();
            }
            return {
                rangeInputs: inputDetails,
                clickedSync: Boolean(syncBtn)
            };
        })()
        """
        eval_id = await send("Runtime.evaluate", {"expression": interaction_script, "returnByValue": True})
        while True:
            res = await ws.recv()
            data = json.loads(res)
            if data.get("id") == eval_id:
                val = data.get("result", {}).get("result", {}).get("value", {})
                print("\n=== INTERACTION TEST RESULT ===")
                print(json.dumps(val, indent=2))
                break

        print("\n=== Post-Interaction Monitoring (4s) ===")
        await listen(4)

        # Capture screenshot to docs/design/screenshots/after/debug-terrain-reproduce.png
        shot_id = await send("Page.captureScreenshot", {"format": "png"})
        while True:
            res = await ws.recv()
            data = json.loads(res)
            if data.get("id") == shot_id:
                b64_data = data.get("result", {}).get("data")
                out_path = os.path.abspath("docs/design/screenshots/after/debug-terrain-reproduce.png")
                os.makedirs(os.path.dirname(out_path), exist_ok=True)
                with open(out_path, "wb") as f:
                    f.write(base64.b64decode(b64_data))
                print(f"\nSaved screenshot to: {out_path} ({len(b64_data)} bytes base64)")
                break

        print(f"\nSummary: {len(console_events)} console events, {len(errors)} errors/exceptions detected.")
        if errors:
            print("ERRORS ENCOUNTERED:")
            for e in errors:
                print("  -", e)
        else:
            print("ALL CHECKS PASSED: ZERO RUNTIME ERRORS OR EXCEPTIONS.")

if __name__ == "__main__":
    asyncio.run(verify())
