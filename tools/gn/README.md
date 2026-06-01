# GN Build Arguments

This directory contains GN build argument files for Aether.

## Files

- `aether_args.gn` — Aether's GN build arguments. Applied by `tools/scripts/build.ps1`.

## Applying Args Manually

If running GN directly:
```cmd
cd C:\src\brave-browser
gn gen src/out/AetherDebug --args="is_component_build=true is_debug=false symbol_level=1 target_cpu=\"x64\" enable_nacl=false proprietary_codecs=true ffmpeg_branding=\"Chrome\" use_lld=true use_thin_lto=false concurrent_links=2"
```

Do not paste the comment lines from aether_args.gn into GN args directly.
GN args syntax does not support shell-style comments in the args string.
