import React from "react";
import { useSettingsStore } from "@/chrome/store/settingsStore";
import type { AppearanceSettings } from "@/chrome/store/settingsStore";
import { Toggle, SettingsRow, SettingsSection } from "@/shared/components/settings";
import "../SettingsContent.css";
import "./AppearanceSection.css";

function useAppearance(): {
  theme: AppearanceSettings["theme"];
  bookmarksBarVisible: boolean;
  showTabCountInStatusBar: boolean;
} {
  return useSettingsStore((s) => ({
    theme: s.theme,
    bookmarksBarVisible: s.bookmarksBarVisible,
    showTabCountInStatusBar: s.showTabCountInStatusBar,
  }));
}

const THEME_OPTIONS: { value: AppearanceSettings["theme"]; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "system", label: "System" },
  { value: "dark", label: "Dark" },
];

function ThemeSelector(): React.JSX.Element {
  const theme = useSettingsStore((s) => s.theme);

  return (
    <div className="theme-selector">
      {THEME_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          className={`theme-selector-btn ${theme === opt.value ? "active" : "inactive"}`}
          onClick={() => {
            useSettingsStore.getState().setAppearance("theme", opt.value);
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function AppearanceSection(): React.JSX.Element {
  const { bookmarksBarVisible, showTabCountInStatusBar } = useAppearance();

  return (
    <div>
      <div className="settings-page-title">Appearance</div>

      <SettingsSection title="Theme">
        <SettingsRow
          label="Theme"
          control={<ThemeSelector />}
        />
      </SettingsSection>

      <SettingsSection title="Interface">
        <SettingsRow
          label="Show Bookmarks Bar"
          control={
            <Toggle
              checked={bookmarksBarVisible}
              onChange={(v) => {
                useSettingsStore.getState().setAppearance("bookmarksBarVisible", v);
              }}
            />
          }
        />
        <SettingsRow
          label="Show Tab Count in Status Bar"
          control={
            <Toggle
              checked={showTabCountInStatusBar}
              onChange={(v) => {
                useSettingsStore.getState().setAppearance("showTabCountInStatusBar", v);
              }}
            />
          }
        />
      </SettingsSection>
    </div>
  );
}
