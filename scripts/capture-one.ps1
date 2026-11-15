$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$outFile = "C:\Users\Abhijeet\.gemini\antigravity\brain\c4ac82fa-eb4e-4ebe-97ab-d87d5a97eb80\screen-02-fresh.png"
$url = "http://localhost:3000/terrain"

$argsList = @(
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--window-size=1440,900",
    "--hide-scrollbars",
    "--virtual-time-budget=4000",
    "--run-all-compositor-stages-before-draw",
    "--screenshot=$outFile",
    $url
)

Start-Process -FilePath $chromePath -ArgumentList $argsList -Wait
Write-Host "Done, size:" (Get-Item $outFile).Length
