import React from "react";
import { useSettingsStore } from "@/chrome/store/settingsStore";
import { Toggle, SettingsRow, SettingsSection } from "@/shared/components/settings";
import "../SettingsContent.css";

function usePrivacy(): {
  adBlockingEnabled: boolean;
  trackerBlockingEnabled: boolean;
  httpsEverywhereEnabled: boolean;
  fingerprintProtectionEnabled: boolean;
  sendDNTHeader: boolean;
} {
  return useSettingsStore((s) => ({
    adBlockingEnabled: s.adBlockingEnabled,
    trackerBlockingEnabled: s.trackerBlockingEnabled,
    httpsEverywhereEnabled: s.httpsEverywhereEnabled,
    fingerprintProtectionEnabled: s.fingerprintProtectionEnabled,
    sendDNTHeader: s.sendDNTHeader,
  }));
}

export function PrivacySection(): React.JSX.Element {
  const {
    adBlockingEnabled,
    trackerBlockingEnabled,
    httpsEverywhereEnabled,
    fingerprintProtectionEnabled,
    sendDNTHeader,
  } = usePrivacy();

  const setPrivacy = useSettingsStore.getState().setPrivacy;

  return (
    <div>
      <div className="settings-page-title">Privacy &amp; Security</div>

      <SettingsSection title="Protection">
        <SettingsRow
          label="Block Ads and Trackers"
          description="Removes ads and prevents tracking across websites"
          control={
            <Toggle
              checked={adBlockingEnabled}
              onChange={(v) => { setPrivacy("adBlockingEnabled", v); }}
            />
          }
        />
        <SettingsRow
          label="Block Cross-site Trackers"
          description="Prevents websites from tracking you across the web"
          control={
            <Toggle
              checked={trackerBlockingEnabled}
              onChange={(v) => { setPrivacy("trackerBlockingEnabled", v); }}
            />
          }
        />
        <SettingsRow
          label="Upgrade to HTTPS"
          description="Automatically use encrypted connections when available"
          control={
            <Toggle
              checked={httpsEverywhereEnabled}
              onChange={(v) => { setPrivacy("httpsEverywhereEnabled", v); }}
            />
          }
        />
      </SettingsSection>

      <SettingsSection title="Fingerprinting">
        <SettingsRow
          label="Fingerprint Protection"
          description="Randomizes browser fingerprint to reduce tracking"
          control={
            <Toggle
              checked={fingerprintProtectionEnabled}
              onChange={(v) => { setPrivacy("fingerprintProtectionEnabled", v); }}
            />
          }
        />
        <SettingsRow
          label="Send Do Not Track"
          description="Requests that websites do not track your activity"
          control={
            <Toggle
              checked={sendDNTHeader}
              onChange={(v) => { setPrivacy("sendDNTHeader", v); }}
            />
          }
        />
      </SettingsSection>
    </div>
  );
}
