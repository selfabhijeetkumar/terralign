$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$outDir = "C:\NASA SPACE HACKATHON\docs\design\screenshots"
$brainDir = "C:\Users\Abhijeet\.gemini\antigravity\brain\c4ac82fa-eb4e-4ebe-97ab-d87d5a97eb80"

$screens = @(
    @{ name = "terralign-2.0-screen-06-datasets"; path = "/datasets" },
    @{ name = "terralign-2.0-screen-01-mission"; path = "/mission" },
    @{ name = "terralign-2.0-screen-05-live-data"; path = "/live-data" },
    @{ name = "terralign-2.0-screen-04-portfolio"; path = "/portfolio" },
    @{ name = "terralign-2.0-screen-02-terrain"; path = "/terrain" }
)

foreach ($s in $screens) {
    $tempShot = Join-Path $env:TEMP "$($s.name).png"
    $outFile = Join-Path $outDir "$($s.name).png"
    $brainFile = Join-Path $brainDir "$($s.name).png"
    
    if (Test-Path $tempShot) { Remove-Item -Force $tempShot }
    
    $argsList = @(
        "--headless=new",
        "--no-sandbox",
        "--disable-gpu",
        "--window-size=1440,900",
        "--hide-scrollbars",
        "--virtual-time-budget=5000",
        "--run-all-compositor-stages-before-draw",
        "--screenshot=$tempShot",
        "http://localhost:3000$($s.path)"
    )
    
    Start-Process -FilePath $chromePath -ArgumentList $argsList -Wait
    if (Test-Path $tempShot) {
        Copy-Item -Path $tempShot -Destination $outFile -Force
        Copy-Item -Path $tempShot -Destination $brainFile -Force
        $len = (Get-Item $tempShot).Length
        Write-Host "Captured $($s.name) -> Size: $len bytes"
        Remove-Item -Force $tempShot
    } else {
        Write-Warning "Failed to capture $($s.name)"
    }
}
