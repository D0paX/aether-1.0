$patchDir = "E:\src\brave-browser\src\brave\patches"
$outFile = "E:\Aether\scratch\brave_stubs.h"
$macros = @()

$files = Get-ChildItem -Path $patchDir -Filter "*.patch" -Recurse
foreach ($file in $files) {
    $lines = Get-Content $file.FullName
    foreach ($line in $lines) {
        if ($line -match '^\+\s*(BRAVE_[A-Z0-9_]+)\s*$') {
            $macros += $matches[1]
        }
    }
}

$macros = $macros | Sort-Object -Unique

$outContent = ""
foreach ($m in $macros) {
    $outContent += "#ifndef $m`n"
    $outContent += "#define $m`n"
    $outContent += "#endif`n"
}

Set-Content -Path $outFile -Value $outContent
Write-Host "Generated $($macros.Count) macros in $outFile"
