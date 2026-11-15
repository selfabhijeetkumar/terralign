$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$outDir = "C:\NASA SPACE HACKATHON\docs\design\screenshots\after"
$url = "http://localhost:3000/terrain"

$viewports = @(
    @{ label = "1440x900"; width = 1440; height = 900 },
    @{ label = "1280x800"; width = 1280; height = 800 },
    @{ label = "390x844";  width = 390;  height = 844 }
)

foreach ($vp in $viewports) {
    $outFile = Join-Path $outDir "screen-02-terrain-studio-$($vp.label).png"
    $brainFile = "C:\Users\Abhijeet\.gemini\antigravity\brain\c4ac82fa-eb4e-4ebe-97ab-d87d5a97eb80\terrain-studio-refined-$($vp.label).png"
    $tempShot = Join-Path $env:TEMP "terrain-$($vp.label)-$([Guid]::NewGuid().ToString('N')).png"
    $windowSize = "$($vp.width),$($vp.height)"

    Write-Host "Capturing Terrain Studio at $($vp.label)..."
    
    $argsList = @(
        "--headless=new",
        "--no-sandbox",
        "--disable-gpu",
        "--window-size=$windowSize",
        "--hide-scrollbars",
        "--virtual-time-budget=4000",
        "--run-all-compositor-stages-before-draw",
        "--screenshot=$tempShot",
        $url
    )

    Start-Process -FilePath $chromePath -ArgumentList $argsList -Wait

    if (Test-Path $tempShot) {
        Move-Item -Force $tempShot $outFile
        Copy-Item -Force $outFile $brainFile
        $size = (Get-Item $outFile).Length
        Write-Host "  -> Saved: $outFile ($size bytes)"
    } else {
        Write-Host "  -> FAILED: Temp shot not found for $($vp.label)"
    }
}
