# ADR-001 — Browser Foundation: Brave Fork over Direct Chromium Fork

- Status: Accepted
- Date: 2026-05-31
- Deciders: Founding engineering team

## Context

Aether requires a browser foundation that provides:
- A real rendering engine capable of competing with Chrome
- Chrome extension compatibility
- Per-tab process isolation and sandbox architecture
- A network stack where ad blocking and tracker blocking can operate
- Cross-platform support targeting Windows first, Android second

The three candidate foundations evaluated were: Direct Chromium Fork, Electron, and Tauri. Two additional options evaluated as part of this decision were: Raw Chromium Fork versus Brave Fork.

## Decision

Aether will use the Brave Browser repository as its starting foundation.

## Alternatives Considered

### Tauri
Rejected. Tauri wraps a system WebView (WKWebView, WebView2, WebKitGTK). Building on Tauri produces a browser-shaped application, not a browser. Key capabilities impossible on Tauri: Chrome extension compatibility, network-layer ad blocking, fingerprint protection at the engine level, custom DevTools, per-tab process isolation under our control. Every browser that competes with Chrome is built on Chromium. This was not a viable option.

### Electron
Rejected. Electron bundles Chromium for desktop application development. Building a browser in Electron creates a browser inside a browser. The IPC model is designed for app-to-renderer communication, not browser tab management. Memory overhead per window is prohibitive. Electron does not expose Chromium's internal browser APIs.

### Direct Chromium Fork
Evaluated. A direct Chromium fork gives maximum long-term control. However, for a small founding team it requires: manually stripping all Google services (months of work), building an ad blocking engine from scratch (6–12 months), implementing fingerprint protection at the engine level (additional months), and establishing a full Chromium rebase pipeline (ongoing weekly cost). The time-to-first-usable-browser is 4–6 months minimum.

### Brave Fork (Chosen)
Brave is an open-source Chromium fork (MPL 2.0 / Apache 2.0). It has already completed: Google services removal, ad blocking engine (brave/adblock-rust, operating in the network service process), fingerprint randomization at the canvas, WebGL, AudioContext, and font enumeration API level, privacy-safe defaults, and a proven Windows build system.

Using Brave as the starting point reduces time-to-first-usable-browser from 4–6 months to 3–6 weeks. The Brave team handles Chromium rebases, reducing ongoing maintenance burden by approximately 80% in the first year compared to a direct Chromium fork.

What is removed from Brave to create Aether: Brave Wallet, Brave Rewards, Brave News, Brave Ads, BAT integration, and Brave's account/sync system. All of Brave's privacy and security infrastructure is retained.

## Consequences

Positive:
- 3–6 week path to first working Aether-branded build on Windows.
- Ad blocking and fingerprint protection available from day one.
- Chromium upstream security patches applied by the Brave team, then pulled by Aether.
- Build system is documented and proven.

Negative:
- Aether's Chromium rebase is now one step removed from upstream (Chromium → Brave → Aether).
- Brave occasionally lags behind Chromium's latest release by one release cycle.
- Brave-specific architectural decisions in their codebase may occasionally need to be worked around.

Mitigation:
- Monitor Brave's release cadence. If Brave falls more than two release cycles behind Chromium, evaluate direct Chromium fork as a longer-term migration.
- Document all Aether-specific departures from Brave's architecture in subsequent ADRs.

## Review Trigger

This decision should be reviewed if: the Brave team significantly changes their open-source licensing, Brave falls more than three Chromium releases behind, or the team grows to 10+ engineers and the maintainability trade-off inverts.
