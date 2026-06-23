import React from "react";
import "./SettingsSection.css";

export interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps): React.JSX.Element {
  return (
    <div className="settings-section">
      <div className="settings-section-title">{title}</div>
      <div className="settings-section-children">{children}</div>
    </div>
  );
}
