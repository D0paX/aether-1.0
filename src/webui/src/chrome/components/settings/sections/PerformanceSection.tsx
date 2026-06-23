import React from "react";
import { useSettingsStore } from "@/chrome/store/settingsStore";
import { Toggle, SettingsRow, SettingsSection } from "@/shared/components/settings";
import "../SettingsContent.css";

export function PerformanceSection(): React.JSX.Element {
  const memorySaverEnabled = useSettingsStore((s) => s.memorySaverEnabled);
  const backgroundTabSleepEnabled = useSettingsStore((s) => s.backgroundTabSleepEnabled);
  const hardwareAccelerationEnabled = useSettingsStore((s) => s.hardwareAccelerationEnabled);

  const setPerformance = useSettingsStore.getState().setPerformance;

  return (
    <div>
      <div className="settings-page-title">Performance</div>

      <SettingsSection title="Memory">
        <SettingsRow
          label="Memory Saver"
          description="Reduces memory usage by sleeping inactive tabs after 30 minutes. Tabs reload when revisited."
          control={
            <Toggle
              checked={memorySaverEnabled}
              onChange={(v) => { setPerformance("memorySaverEnabled", v); }}
            />
          }
        />
        <SettingsRow
          label="Sleep Background Tabs"
          description="Automatically suspends tabs not in use to save resources"
          control={
            <Toggle
              checked={backgroundTabSleepEnabled}
              onChange={(v) => { setPerformance("backgroundTabSleepEnabled", v); }}
            />
          }
        />
      </SettingsSection>

      <SettingsSection title="Graphics">
        <SettingsRow
          label="Hardware Acceleration"
          description="Uses your GPU to speed up rendering. Restart required to take effect."
          control={
            <Toggle
              checked={hardwareAccelerationEnabled}
              onChange={(v) => { setPerformance("hardwareAccelerationEnabled", v); }}
            />
          }
        />
      </SettingsSection>
    </div>
  );
}
