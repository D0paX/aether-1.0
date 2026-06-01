# Aether Browser — Placeholder Icon Generator
# Generates placeholder PNG icons at standard sizes and an ICO file.
# These are temporary placeholders. Production icons will be designed
# professionally and must replace these before public release.
#
# Usage: .\generate-icons.ps1
# Output: aether/src/browser/icons/

[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

# Placeholder brand color: dark navy
$BrandColorHex = "#1A1A2E"
$TextColorHex  = "#FFFFFF"
$FontFamily    = "Arial"
$GlyphChar     = "A"

# Icon sizes to generate as PNG files
$PngSizes = @(16, 32, 48, 64, 128, 256, 512)

# Sizes to include in the ICO file (standard Windows icon sizes)
$IcoSizes = @(16, 32, 48, 256)

# Output directory relative to the repository root
# $PSScriptRoot is tools/scripts, so two levels up reaches the repo root.
$RepoRoot  = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$OutputDir = Join-Path $RepoRoot "src\browser\icons"

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

function Write-Status {
    param([string]$Message)
    Write-Host "[generate-icons] $Message"
}

function Write-Pass {
    param([string]$Message)
    Write-Host "[PASS] $Message" -ForegroundColor Green
}

function Write-Fail {
    param([string]$Message)
    Write-Host "[FAIL] $Message" -ForegroundColor Red
}

# ---------------------------------------------------------------------------
# Load System.Drawing
# ---------------------------------------------------------------------------

Add-Type -AssemblyName System.Drawing

# Parse brand colors
$BrandColor = [System.Drawing.ColorTranslator]::FromHtml($BrandColorHex)
$TextColor  = [System.Drawing.ColorTranslator]::FromHtml($TextColorHex)

# ---------------------------------------------------------------------------
# Ensure output directory exists
# ---------------------------------------------------------------------------

if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
    Write-Status "Created output directory: $OutputDir"
}

# ---------------------------------------------------------------------------
# Generate PNG icons
# ---------------------------------------------------------------------------

Write-Status "Generating placeholder PNG icons..."

$GeneratedPngs = @{}

foreach ($Size in $PngSizes) {
    $Bitmap = New-Object System.Drawing.Bitmap($Size, $Size)
    $Graphics = [System.Drawing.Graphics]::FromImage($Bitmap)

    # Configure rendering quality
    $Graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $Graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $Graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

    # Fill background with brand color
    $BrandBrush = New-Object System.Drawing.SolidBrush($BrandColor)
    $Graphics.FillRectangle($BrandBrush, 0, 0, $Size, $Size)

    # Calculate font size. The glyph should occupy roughly 60% of the icon height.
    # For very small icons (16px), use a slightly larger ratio so the letter remains legible.
    $FontSizeRatio = if ($Size -le 16) { 0.70 } elseif ($Size -le 32) { 0.65 } else { 0.60 }
    $FontSize = [Math]::Max(6, [Math]::Floor($Size * $FontSizeRatio))

    $Font = New-Object System.Drawing.Font($FontFamily, $FontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $TextBrush = New-Object System.Drawing.SolidBrush($TextColor)

    # Measure the glyph and center it
    $MeasuredSize = $Graphics.MeasureString($GlyphChar, $Font)
    $X = ($Size - $MeasuredSize.Width) / 2
    $Y = ($Size - $MeasuredSize.Height) / 2

    $Graphics.DrawString($GlyphChar, $Font, $TextBrush, $X, $Y)

    # Save PNG
    $FileName = "aether_${Size}x${Size}.png"
    $FilePath = Join-Path $OutputDir $FileName
    $Bitmap.Save($FilePath, [System.Drawing.Imaging.ImageFormat]::Png)

    $GeneratedPngs[$Size] = $FilePath
    Write-Pass "Generated $FileName ($Size x $Size)"

    # Dispose GDI objects
    $TextBrush.Dispose()
    $Font.Dispose()
    $BrandBrush.Dispose()
    $Graphics.Dispose()
    $Bitmap.Dispose()
}

# ---------------------------------------------------------------------------
# Generate ICO file
# ---------------------------------------------------------------------------

Write-Status "Generating aether.ico..."

$IcoPath = Join-Path $OutputDir "aether.ico"

# ICO file format:
#   Header (6 bytes): reserved(2) + type(2, 1=ICO) + count(2)
#   Directory entries (16 bytes each): width, height, colors, reserved, planes, bpp, size, offset
#   Image data: PNG-encoded bitmap data for each entry
#
# Modern ICO files embed PNG data directly for each size.

try {
    $IcoStream = [System.IO.MemoryStream]::new()
    $Writer = [System.IO.BinaryWriter]::new($IcoStream)

    $ImageCount = $IcoSizes.Count

    # Write ICO header
    $Writer.Write([UInt16]0)              # Reserved, must be 0
    $Writer.Write([UInt16]1)              # Type: 1 = ICO
    $Writer.Write([UInt16]$ImageCount)    # Number of images

    # Collect PNG data for each size
    $PngDataList = @()
    foreach ($IcoSize in $IcoSizes) {
        $PngFile = $GeneratedPngs[$IcoSize]
        if (-not $PngFile -or -not (Test-Path $PngFile)) {
            Write-Fail "Missing PNG for size $IcoSize -- cannot include in ICO"
            continue
        }
        $PngBytes = [System.IO.File]::ReadAllBytes($PngFile)
        $PngDataList += ,@{
            Size  = $IcoSize
            Bytes = $PngBytes
        }
    }

    # Calculate data offset: header (6) + directory entries (16 each)
    $DataOffset = 6 + ($PngDataList.Count * 16)

    # Write directory entries
    foreach ($Entry in $PngDataList) {
        # Width and height: 0 means 256 in ICO format
        $WidthByte  = if ($Entry.Size -ge 256) { [byte]0 } else { [byte]$Entry.Size }
        $HeightByte = if ($Entry.Size -ge 256) { [byte]0 } else { [byte]$Entry.Size }

        $Writer.Write($WidthByte)              # Width
        $Writer.Write($HeightByte)             # Height
        $Writer.Write([byte]0)                 # Color palette count (0 = no palette)
        $Writer.Write([byte]0)                 # Reserved
        $Writer.Write([UInt16]1)               # Color planes
        $Writer.Write([UInt16]32)              # Bits per pixel
        $Writer.Write([UInt32]$Entry.Bytes.Length)  # Image data size
        $Writer.Write([UInt32]$DataOffset)     # Offset to image data

        $DataOffset += $Entry.Bytes.Length
    }

    # Write image data
    foreach ($Entry in $PngDataList) {
        $Writer.Write($Entry.Bytes)
    }

    $Writer.Flush()

    # Write the ICO file to disk
    [System.IO.File]::WriteAllBytes($IcoPath, $IcoStream.ToArray())

    $Writer.Dispose()
    $IcoStream.Dispose()

    Write-Pass "Generated aether.ico ($($IcoSizes -join ', ') px)"
}
catch {
    Write-Fail "Could not generate ICO file: $($_.Exception.Message)"
    Write-Status "Manual alternative: use ImageMagick to combine PNGs into an ICO:"
    Write-Status "  magick aether_16x16.png aether_32x32.png aether_48x48.png aether_256x256.png aether.ico"
}

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------

Write-Host ""
Write-Status "Icon generation complete."
Write-Status "Output directory: $OutputDir"
Write-Host ""

$AllFiles = Get-ChildItem -Path $OutputDir -File | Where-Object { $_.Extension -in ".png", ".ico" }
Write-Status "Generated files:"
foreach ($File in $AllFiles) {
    $SizeKB = [Math]::Round($File.Length / 1024, 1)
    Write-Host "  $($File.Name)  ($SizeKB KB)"
}

Write-Host ""
Write-Status "These are placeholder icons. Replace with production artwork before public release."
