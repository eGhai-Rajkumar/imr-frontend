$file = 'd:\27-Oct-25\indian-mountain-rovers\src\pages\admin\modules\QuotationManagement\components\QuotationPDFTemplates.jsx'
$lines = Get-Content $file
# Keep only lines 1-1454 (0-indexed: 0-1453)
$keep = $lines[0..1453]
Set-Content -Path $file -Value $keep -Encoding UTF8
Write-Host "Done. New line count: $($keep.Length)"
