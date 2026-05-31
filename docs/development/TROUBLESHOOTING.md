# Troubleshooting — Windows Build Environment

## Environment Setup Issues

### Problem: gclient sync fails with "Git returned unexpected return code"
- **Symptom**: gclient sync exits with a git error during the initial checkout.
- **Root cause**: Long path support is not enabled or Windows was not restarted after enabling it.
- **Fix**: Confirm LongPathsEnabled registry key is 1. Restart Windows. Run `gclient sync` again.

### Problem: Python not found during build
- **Symptom**: GN or ninja reports "python: command not found" or "python3: command not found".
- **Root cause**: Python is installed but not on the system PATH, or only on the user PATH.
- **Fix**: Open System Properties > Environment Variables > System Variables > Path. Add the Python install directory (e.g., C:\Python311). Restart your terminal.

### Problem: MSVC not found by GN
- **Symptom**: GN reports "Windows SDK or Visual Studio was not found."
- **Root cause**: The vs2022_install environment variable is missing or points to the wrong path.
- **Fix**: Set vs2022_install to the exact path of your VS 2022 install. Common paths:
  - C:\Program Files\Microsoft Visual Studio\2022\Community
  - C:\Program Files\Microsoft Visual Studio\2022\Professional
  Run: `setx vs2022_install "C:\Program Files\Microsoft Visual Studio\2022\Community" /M`

### Problem: depot_tools commands not found after installation
- **Symptom**: Running `gclient` returns "command not found".
- **Root cause**: C:\depot_tools was not added to the system PATH, or the terminal was not restarted.
- **Fix**: Add C:\depot_tools to system PATH via Environment Variables. Open a new terminal window.

### Problem: "The filename or extension is too long" during gclient sync
- **Symptom**: File copy errors during gclient sync with path length errors.
- **Root cause**: Long path support is not active.
- **Fix**: Verify HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem\LongPathsEnabled = 1. Restart Windows. Delete the partial checkout and start from scratch.

## Build Failures

### Problem: Build fails with "ninja: error: loading 'build.ninja'"
- **Symptom**: Ninja cannot find build.ninja on first build.
- **Root cause**: GN configuration was not run before ninja. The out/ directory was not generated.
- **Fix**: Run `npm run build` from the brave-browser root, which runs GN before ninja automatically. Never run ninja directly without running GN first.

### Problem: Out of disk space during build
- **Symptom**: Build fails with write error or disk full error.
- **Root cause**: Chromium debug build artifacts can exceed 80 GB.
- **Fix**: Free disk space or build on a different drive. Set the out/ directory to a drive with more space by modifying the GN output directory argument.

### Problem: Build runs out of memory (RAM)
- **Symptom**: Build process killed, linker crash, system becomes unresponsive.
- **Root cause**: Chromium linking is extremely memory-intensive. 16 GB RAM is not enough for parallel linking.
- **Fix**: Add to GN args: `concurrent_links = 1` to serialize linking steps. This is slower but uses less peak memory.

### Problem: cl.exe crashes with C1060 (heap space exhausted)
- **Symptom**: Individual C++ compilation units fail with heap exhaustion.
- **Root cause**: Some Chromium translation units are enormous. 32 GB RAM is the practical minimum.
- **Fix**: Add `use_jumbo_build = false` to GN args to disable unity builds. Add `jumbo_build_excluded_sources = []`. Reduce parallel jobs: set `j` flag to CPU cores minus 2.

### Problem: Incremental builds rebuild everything
- **Symptom**: Every build takes as long as the first build.
- **Root cause**: A file that many other files include was modified, or the GN args changed.
- **Fix**: Check if a core header was accidentally modified. If GN args changed, a full rebuild is expected and correct. Ensure `is_component_build = true` in development GN args to minimize rebuild scope.

## Runtime Issues

### Problem: Browser crashes immediately on launch
- **Symptom**: The compiled browser.exe exits within 1-2 seconds with no window.
- **Root cause**: Usually a missing DLL, a missing resource file, or a crash in early initialization.
- **Fix**: Run from a terminal to see stderr output. Check Windows Event Viewer > Application for crash details. Ensure the build completed without errors before attempting to run.

### Problem: Browser launches but all pages show "ERR_NETWORK_CHANGED"
- **Symptom**: No pages load, network errors on all URLs.
- **Root cause**: Network service process failed to start.
- **Fix**: Check that no antivirus is blocking the browser's subprocess spawning. Try running as Administrator once to rule out permission issues.
