$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$routes = @(
    @{ name = "screen-03-reality-gap"; path = "/reality-gap" },
    @{ name = "screen-04-portfolio-optimizer"; path = "/portfolio" }
)

foreach ($r in $routes) {
    $outFile = "C:\Users\Abhijeet\.gemini\antigravity\brain\c4ac82fa-eb4e-4ebe-97ab-d87d5a97eb80\$($r.name)-fresh.png"
    $argsList = @(
        "--headless=new",
        "--no-sandbox",
        "--disable-gpu",
        "--window-size=1440,900",
        "--hide-scrollbars",
        "--virtual-time-budget=4000",
        "--run-all-compositor-stages-before-draw",
        "--screenshot=$outFile",
        "http://localhost:3000$($r.path)"
    )
    Start-Process -FilePath $chromePath -ArgumentList $argsList -Wait
    Write-Host "Saved $($r.name), size: " (Get-Item $outFile).Length
}
