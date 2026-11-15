import subprocess
import urllib.request
import json
import time
import asyncio
import websockets

def run_test():
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    port = 9333
    chrome_cmd = [
        chrome_path,
        f"--remote-debugging-port={port}",
        "--headless=new",
        "--no-sandbox",
        "--disable-gpu",
        "http://localhost:3000/terrain"
    ]
    proc = subprocess.Popen(chrome_cmd)
    time.sleep(2.5)

    async def check():
        try:
            req = urllib.request.Request(f"http://127.0.0.1:{port}/json")
            tabs = json.loads(urllib.request.urlopen(req).read().decode())
            ws_url = tabs[0]["webSocketDebuggerUrl"]
            async with websockets.connect(ws_url) as ws:
                msg_id = 0
                async def send(method, params=None):
                    nonlocal msg_id
                    msg_id += 1
                    payload = {"id": msg_id, "method": method}
                    if params: payload["params"] = params
                    await ws.send(json.dumps(payload))

                await send("Runtime.enable")
                await send("Console.enable")
                await send("Log.enable")

                logs = []
                errors = []
                end_time = asyncio.get_event_loop().time() + 3.0
                while asyncio.get_event_loop().time() < end_time:
                    try:
                        raw = await asyncio.wait_for(ws.recv(), timeout=0.4)
                        msg = json.loads(raw)
                        method = msg.get("method", "")
                        params = msg.get("params", {})
                        if method == "Console.messageAdded":
                            msg_text = params.get("message", {}).get("text", "")
                            level = params.get("message", {}).get("level", "")
                            logs.append(f"[{level}] {msg_text}")
                            if level in ("error", "assert"):
                                errors.append(msg_text)
                        elif method == "Runtime.exceptionThrown":
                            details = params.get("exceptionDetails", {})
                            exc_text = details.get("text", "") + " " + str(details.get("exception", {}).get("description", ""))
                            errors.append(exc_text)
                    except asyncio.TimeoutError:
                        pass

                print("Console messages captured:", len(logs))
                for log in logs:
                    print("  ", log)
                print("Total Errors:", len(errors))
                for err in errors:
                    print("  ERROR:", err)
        finally:
            proc.terminate()

    asyncio.run(check())

if __name__ == "__main__":
    run_test()
