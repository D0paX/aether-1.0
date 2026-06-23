/**
 * Side effects that synchronize settingsStore changes with uiStore.
 *
 * Must be called once at app startup, AFTER Zustand persist has
 * hydrated the settings from localStorage. We wait for the
 * onRehydrateStorage callback before subscribing to avoid
 * reacting to stale default values.
 */

import { useSettingsStore } from "./settingsStore";
import { useUIStore } from "./uiStore";

let initialized = false;

export function initSettingsSideEffects(): void {
  if (initialized) return;
  initialized = true;

  const settingsApi = useSettingsStore;
  const uiApi = useUIStore;

  // Perform an initial sync from the (possibly hydrated) settings
  // into uiStore so the two stores start in agreement.
  const currentSettings = settingsApi.getState();
  uiApi.getState().setTheme(currentSettings.theme);
  if (currentSettings.bookmarksBarVisible !== uiApi.getState().bookmarksBarVisible) {
    uiApi.getState().toggleBookmarksBar();
  }

  // Subscribe to future theme changes
  settingsApi.subscribe(
    (state) => state.theme,
    (theme) => {
      uiApi.getState().setTheme(theme);
    },
  );

  // Subscribe to future bookmarksBarVisible changes
  settingsApi.subscribe(
    (state) => state.bookmarksBarVisible,
    (visible) => {
      if (visible !== uiApi.getState().bookmarksBarVisible) {
        uiApi.getState().toggleBookmarksBar();
      }
    },
  );
}
