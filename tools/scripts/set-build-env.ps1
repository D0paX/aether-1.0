# Aether Browser — Build Environment Setup
# Dot-source this at the start of any session that needs to run
# brave-core/Chromium build commands: . tools\scripts\set-build-env.ps1
# This terminal is not Administrator-elevated, so all persistence
# below uses plain setx (HKCU/user scope) rather than setx /M.

$env:NVM_HOME = "C:\Users\dopax\AppData\Local\nvm"
$env:NVM_SYMLINK = "C:\Program Files\nodejs"
$env:Path = "$env:NVM_HOME;$env:NVM_SYMLINK;E:\src\brave-browser\src\brave\vendor\depot_tools;" + $env:Path

nvm use 24.17.0 | Out-Null

$env:DEPOT_TOOLS_WIN_TOOLCHAIN = "0"
$env:vs2022_install = "C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools"
$env:BRAVE_SRC = "E:\src\brave-browser"

# Persist at user scope (no /M — proven to actually work on this machine)
setx DEPOT_TOOLS_WIN_TOOLCHAIN 0 | Out-Null
setx vs2022_install "C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools" | Out-Null
setx BRAVE_SRC "E:\src\brave-browser" | Out-Null

Write-Host "Build environment set:" -ForegroundColor Green
Write-Host "  Node:                      $(node --version)"
Write-Host "  DEPOT_TOOLS_WIN_TOOLCHAIN: $env:DEPOT_TOOLS_WIN_TOOLCHAIN"
Write-Host "  vs2022_install:            $env:vs2022_install"
Write-Host "  BRAVE_SRC:                 $env:BRAVE_SRC"
