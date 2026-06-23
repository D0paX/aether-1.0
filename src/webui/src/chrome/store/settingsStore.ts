/**
 * Aether Settings Store
 *
 * Persists user preferences to localStorage via Zustand's persist middleware.
 *
 * MIGRATION NOTE (Batch 22):
 * localStorage is a temporary persistence mechanism used during WebUI
 * prototyping. In Batch 22 this store will be migrated to a Mojo-backed
 * preferences service that syncs with the C++ browser prefs system
 * (PrefService). At that point the persist middleware will be replaced
 * by Mojo IPC calls and the localStorage key "aether-settings" will be
 * removed.
 */

import { create } from "zustand";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";

// ---------------------------------------------------------------------------
// Type definitions for each settings group
// ---------------------------------------------------------------------------

export interface PrivacySettings {
  adBlockingEnabled: boolean;
  trackerBlockingEnabled: boolean;
  httpsEverywhereEnabled: boolean;
  fingerprintProtectionEnabled: boolean;
  sendDNTHeader: boolean;
}

export interface AppearanceSettings {
  theme: "light" | "dark" | "system";
  bookmarksBarVisible: boolean;
  showTabCountInStatusBar: boolean;
}

export interface PerformanceSettings {
  hardwareAccelerationEnabled: boolean;
  memorySaverEnabled: boolean;
  backgroundTabSleepEnabled: boolean;
}

export interface GeneralSettings {
  defaultSearchEngine: "google" | "brave" | "duckduckgo" | "bing";
  showHomeButton: boolean;
  startupBehavior: "new-tab" | "continue" | "specific";
}

// ---------------------------------------------------------------------------
// Combined store shape
// ---------------------------------------------------------------------------

interface SettingsState
  extends PrivacySettings,
    AppearanceSettings,
    PerformanceSettings,
    GeneralSettings {}

interface SettingsActions {
  setPrivacy: (key: keyof PrivacySettings, value: boolean) => void;
  setAppearance: <K extends keyof AppearanceSettings>(
    key: K,
    value: AppearanceSettings[K],
  ) => void;
  setPerformance: (key: keyof PerformanceSettings, value: boolean) => void;
  setGeneral: <K extends keyof GeneralSettings>(
    key: K,
    value: GeneralSettings[K],
  ) => void;
}

export type SettingsStore = SettingsState & SettingsActions;

// ---------------------------------------------------------------------------
// Keys that belong to each group (used by partialize)
// ---------------------------------------------------------------------------

const SETTINGS_KEYS: (keyof SettingsState)[] = [
  // Privacy
  "adBlockingEnabled",
  "trackerBlockingEnabled",
  "httpsEverywhereEnabled",
  "fingerprintProtectionEnabled",
  "sendDNTHeader",
  // Appearance
  "theme",
  "bookmarksBarVisible",
  "showTabCountInStatusBar",
  // Performance
  "hardwareAccelerationEnabled",
  "memorySaverEnabled",
  "backgroundTabSleepEnabled",
  // General
  "defaultSearchEngine",
  "showHomeButton",
  "startupBehavior",
];

// ---------------------------------------------------------------------------
// Store creation
// ---------------------------------------------------------------------------

export const useSettingsStore = create<SettingsStore>()(
  subscribeWithSelector(
    devtools(
      persist(
        (set) => ({
          // Privacy defaults
          adBlockingEnabled: true,
          trackerBlockingEnabled: true,
          httpsEverywhereEnabled: true,
          fingerprintProtectionEnabled: false,
          sendDNTHeader: false,

          // Appearance defaults
          theme: "system",
          bookmarksBarVisible: true,
          showTabCountInStatusBar: true,

          // Performance defaults
          hardwareAccelerationEnabled: true,
          memorySaverEnabled: true,
          backgroundTabSleepEnabled: false,

          // General defaults
          defaultSearchEngine: "google",
          showHomeButton: false,
          startupBehavior: "new-tab",

          // Actions
          setPrivacy: (key, value) =>
            set({ [key]: value }, false, `settings/privacy/${key}`),

          setAppearance: (key, value) =>
            set(
              { [key]: value } as Partial<SettingsStore>,
              false,
              `settings/appearance/${key}`,
            ),

          setPerformance: (key, value) =>
            set({ [key]: value }, false, `settings/performance/${key}`),

          setGeneral: (key, value) =>
            set(
              { [key]: value } as Partial<SettingsStore>,
              false,
              `settings/general/${key}`,
            ),
        }),
        {
          name: "aether-settings",
          version: 1,
          partialize: (state) =>
            Object.fromEntries(
              SETTINGS_KEYS.map((k) => [k, state[k]]),
            ) as Pick<SettingsStore, keyof SettingsState>,
        },
      ),
      { name: "settings-store", enabled: import.meta.env.DEV },
    ),
  ),
);
