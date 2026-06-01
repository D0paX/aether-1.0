# Brave Icon Locations — Reference for Aether Replacement

This document lists every icon-related file in the Brave/Chromium source tree
that must be replaced with Aether artwork. It is referenced by the icon
replacement patch created in Batch 05.

Status: Compiled from Brave's public repository structure.
Verification: Must be verified against the live source once `C:\src\brave-browser\src\`
is available. Run the verification command at the bottom of this file.

---

## Windows Icon Files

These are the primary icon files compiled into the Windows executable.

| File Path                                                    | Description                          |
|--------------------------------------------------------------|--------------------------------------|
| `brave/app/theme/brave/win/brave.ico`                        | Main browser executable icon         |
| `brave/app/theme/brave/brave_app.ico`                        | Application icon (generic)           |

## Branded PNG Resources

Used in the browser UI, about dialogs, installer, and platform integrations.

| File Path                                                    | Size    | Description                    |
|--------------------------------------------------------------|---------|--------------------------------|
| `brave/app/theme/brave/product_logo_16.png`                  | 16x16   | Favicon, tab icon              |
| `brave/app/theme/brave/product_logo_32.png`                  | 32x32   | Taskbar, context menus         |
| `brave/app/theme/brave/product_logo_48.png`                  | 48x48   | Alt+Tab, add/remove programs   |
| `brave/app/theme/brave/product_logo_64.png`                  | 64x64   | Shortcut icon, dock            |
| `brave/app/theme/brave/product_logo_128.png`                 | 128x128 | About dialog, installer        |
| `brave/app/theme/brave/product_logo_256.png`                 | 256x256 | High-DPI displays              |

## Chromium-Level Icon Overrides

Brave overrides several upstream Chromium icon paths.

| File Path                                                    | Description                          |
|--------------------------------------------------------------|--------------------------------------|
| `chrome/app/theme/chromium/product_logo_16.png`              | Upstream 16px (may be overridden)    |
| `chrome/app/theme/chromium/product_logo_32.png`              | Upstream 32px (may be overridden)    |
| `chrome/app/theme/chromium/product_logo_48.png`              | Upstream 48px (may be overridden)    |
| `chrome/app/theme/chromium/product_logo_128.png`             | Upstream 128px (may be overridden)   |
| `chrome/app/theme/chromium/product_logo_256.png`             | Upstream 256px (may be overridden)   |

## Windows Resource Files

These RC files reference icon resources by path and must be updated.

| File Path                                                    | Contains                             |
|--------------------------------------------------------------|--------------------------------------|
| `brave/app/brave_exe.rc`                                     | `IDR_MAINFRAME ICON` resource entry  |
| `brave/app/brave.rc`                                         | Additional icon resource definitions |
| `chrome/app/chrome_exe.rc`                                   | Upstream RC (Brave may override)     |

## GRD/GRDP String Resource Files

These define icon resources referenced by the UI.

| File Path                                                    | Contains                             |
|--------------------------------------------------------------|--------------------------------------|
| `brave/app/brave_generated_resources.grd`                    | Icon resource IDs                    |
| `brave/app/theme/brave_theme_resources.grd`                  | Themed icon declarations             |
| `chrome/app/theme/chrome_unscaled_resources.grd`             | Upstream icon references             |
| `chrome/app/theme/theme_resources.grd`                       | UI theme icon references             |

## BUILD.gn References

Build files that reference icon paths or branding image directories.

| File Path                                                    | Contains                             |
|--------------------------------------------------------------|--------------------------------------|
| `brave/app/BUILD.gn`                                         | Icon file copy/compile rules         |
| `brave/browser/BUILD.gn`                                     | Browser-level icon references        |
| `brave/installer/BUILD.gn`                                   | Installer icon packaging             |

## macOS Icon Files

Applicable only when targeting macOS. Listed for completeness.

| File Path                                                    | Description                          |
|--------------------------------------------------------------|--------------------------------------|
| `brave/app/theme/brave/mac/app.icns`                         | macOS application icon               |
| `brave/app/theme/brave/mac/document.icns`                    | macOS document icon                  |

## Linux Icon Files

Desktop integration icons for Linux builds.

| File Path                                                    | Size    | Description                    |
|--------------------------------------------------------------|---------|--------------------------------|
| `brave/app/theme/brave/linux/product_logo_16.png`            | 16x16   | Desktop menu icon              |
| `brave/app/theme/brave/linux/product_logo_32.png`            | 32x32   | Desktop menu icon              |
| `brave/app/theme/brave/linux/product_logo_48.png`            | 48x48   | Desktop menu icon              |
| `brave/app/theme/brave/linux/product_logo_64.png`            | 64x64   | Desktop menu icon              |
| `brave/app/theme/brave/linux/product_logo_128.png`           | 128x128 | Desktop menu icon              |
| `brave/app/theme/brave/linux/product_logo_256.png`           | 256x256 | Desktop menu icon              |

## Android Icon Files

Applicable only when targeting Android (Batch 21+).

| File Path                                                    | Description                          |
|--------------------------------------------------------------|--------------------------------------|
| `brave/android/java/res/mipmap-mdpi/app_icon.png`           | 48x48 launcher icon                  |
| `brave/android/java/res/mipmap-hdpi/app_icon.png`           | 72x72 launcher icon                  |
| `brave/android/java/res/mipmap-xhdpi/app_icon.png`          | 96x96 launcher icon                  |
| `brave/android/java/res/mipmap-xxhdpi/app_icon.png`         | 144x144 launcher icon                |
| `brave/android/java/res/mipmap-xxxhdpi/app_icon.png`        | 192x192 launcher icon                |

---

## Verification Command

Once the Brave source is cloned, run this to find all icon references and
compare against this document:

```powershell
# Find all icon-related files in the Brave source
$BraveSrc = "C:\src\brave-browser\src"
Get-ChildItem -Path "$BraveSrc\brave\app" -Recurse -File |
    Where-Object { $_.Extension -in ".ico", ".png", ".icns", ".svg" } |
    ForEach-Object { $_.FullName.Replace($BraveSrc, "") }

# Find all references to brave icon filenames in build/resource files
Get-ChildItem -Path "$BraveSrc\brave\app" -Recurse -File -Include "*.gn","*.gni","*.grd","*.grdp","*.rc" |
    Select-String -Pattern "brave.*\.(ico|png|icns)" -SimpleMatch |
    ForEach-Object { "$($_.Filename):$($_.LineNumber): $($_.Line.Trim())" }
```

Update this document with any additional paths found and re-commit.
