# android — Aether Android Build Target

## Status

Not yet active. Android development begins in Batch 21.

## Planned Architecture

Aether on Android uses Chromium Android (the same base as Chrome for Android) with a Kotlin UI shell for the native Android interface.

The WebUI system (React/TypeScript) is used for browser pages (new tab, settings, history) on Android, served via the same chrome:// scheme mechanism used on desktop.

## Prerequisites for Android Development

- Android Studio (latest stable)
- Android NDK r25 or higher
- Android SDK API level 24 minimum (target API level 34)
- Java Development Kit 17
- Chromium Android build environment setup

## Setup

Android setup instructions will be written in Batch 21. Do not attempt Android builds before completing the Windows desktop foundation (Batches 01–20).
