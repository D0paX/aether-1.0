import React from "react";
import { useSettingsStore } from "@/chrome/store/settingsStore";
import type { GeneralSettings } from "@/chrome/store/settingsStore";
import { Toggle, SettingsRow, SettingsSection } from "@/shared/components/settings";
import "../SettingsContent.css";
import "./GeneralSection.css";

const STARTUP_OPTIONS: { value: GeneralSettings["startupBehavior"]; label: string }[] = [
  { value: "new-tab", label: "Open New Tab" },
  { value: "continue", label: "Continue where you left off" },
  { value: "specific", label: "Open a specific page" },
];

function StartupBehaviorSelector(): React.JSX.Element {
  const startupBehavior = useSettingsStore((s) => s.startupBehavior);

  return (
    <div className="startup-behavior-selector">
      {STARTUP_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          className={`startup-behavior-btn ${
            startupBehavior === opt.value ? "active" : "inactive"
          }`}
          onClick={() => {
            useSettingsStore.getState().setGeneral("startupBehavior", opt.value);
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function GeneralSection(): React.JSX.Element {
  const showHomeButton = useSettingsStore((s) => s.showHomeButton);

  return (
    <div>
      <div className="settings-page-title">General</div>

      <SettingsSection title="On Startup">
        <div className="startup-behavior-wrapper">
          <StartupBehaviorSelector />
        </div>
      </SettingsSection>

      <SettingsSection title="Toolbar">
        <SettingsRow
          label="Show Home Button"
          control={
            <Toggle
              checked={showHomeButton}
              onChange={(v) => {
                useSettingsStore.getState().setGeneral("showHomeButton", v);
              }}
            />
          }
        />
      </SettingsSection>
    </div>
  );
}
