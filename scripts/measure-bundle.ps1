$chunks = Get-ChildItem -Path ".next\static\chunks" -Filter "*.js" -Recurse
$totalRaw = 0
$totalGzip = 0

Write-Host "Measuring all chunks in .next\static\chunks..."
foreach ($file in $chunks) {
    $raw = $file.Length
    $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
    $ms = New-Object System.IO.MemoryStream
    $gs = New-Object System.IO.Compression.GZipStream($ms, [System.IO.Compression.CompressionMode]::Compress)
    $gs.Write($bytes, 0, $bytes.Length)
    $gs.Close()
    $gz = $ms.ToArray().Length
    $totalRaw += $raw
    $totalGzip += $gz
    $rel = $file.FullName.Replace((Get-Location).Path + "\.next\static\chunks\", "")
    Write-Host ("{0,-45} Raw: {1,7}  Gzip: {2,7}" -f $rel, $raw, $gz)
}

Write-Host "------------------------------------------------------------------"
Write-Host ("TOTAL ALL CHUNKS: Raw: {0} ({1:N2} KiB) | Gzip: {2} ({3:N2} KiB / {4:N2} KB)" -f $totalRaw, ($totalRaw/1024), $totalGzip, ($totalGzip/1024), ($totalGzip/1000))
