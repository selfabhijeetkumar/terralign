# TERRALIGN — Multi-Viewport Screenshot Capture Script
# Standards: GSD v1.6.0 · Ponytail FULL

$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$outDir = "C:\NASA SPACE HACKATHON\docs\design\screenshots\after"
$baseUrl = "http://localhost:3000"

$routes = @(
    @{ name = "screen-00-landing";             path = "/" },
    @{ name = "screen-01-mission-command";     path = "/mission" },
    @{ name = "screen-02-terrain-studio";      path = "/terrain" },
    @{ name = "screen-03-reality-gap";         path = "/reality-gap" },
    @{ name = "screen-04-portfolio-optimizer"; path = "/portfolio" },
    @{ name = "supporting-about";              path = "/about" },
    @{ name = "supporting-faq";                path = "/faq" }
)

$viewports = @(
    @{ label = "1440x900"; width = 1440; height = 900 },
    @{ label = "1280x800"; width = 1280; height = 800 },
    @{ label = "390x844";  width = 390;  height = 844 },
    @{ label = "360px";    width = 360;  height = 800 }
)

foreach ($r in $routes) {
    foreach ($vp in $viewports) {
        $outFile = Join-Path $outDir "$($r.name)-$($vp.label).png"
        $tempShot = Join-Path $env:TEMP "$($r.name)-$($vp.label).png"
        $url = "$baseUrl$($r.path)"
        $windowSize = "$($vp.width),$($vp.height)"

        Write-Host "Capturing $($r.name) at $($vp.label)..."
        
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
            $size = (Get-Item $outFile).Length
            Write-Host "  -> Saved: $outFile ($size bytes)"
        } else {
            Write-Warning "  -> Failed to capture $outFile"
        }
    }
}

Write-Host "All viewports captured successfully."
