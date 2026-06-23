import React from "react";
import { SettingsDivider } from "@/shared/components/settings";
import "../SettingsContent.css";
import "./AboutSection.css";

export function AboutSection(): React.JSX.Element {
  return (
    <div>
      <div className="settings-page-title">About Aether</div>
      <div className="about-section-container">
        <div className="about-name">Aether</div>
        <div className="about-version">Version: 1.0.0-dev</div>
        <div className="about-build">Development Build</div>

        <div className="about-divider-wrapper">
          <SettingsDivider />
        </div>

        <div className="about-foundation">
          Built on Chromium / Brave foundation
        </div>
        <div className="about-licenses-wrapper">
          <a href="#" className="about-licenses-link">
            Open source licenses
          </a>
        </div>
      </div>
    </div>
  );
}
