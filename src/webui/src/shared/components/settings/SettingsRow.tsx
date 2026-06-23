import React from "react";
import "./SettingsRow.css";

export interface SettingsRowProps {
  label: string;
  description?: string;
  control: React.ReactNode;
  onClick?: () => void;
}

export function SettingsRow({
  label,
  description,
  control,
  onClick,
}: SettingsRowProps): React.JSX.Element {
  return (
    <div className={`settings-row ${onClick ? "clickable" : ""}`} onClick={onClick}>
      <div className="settings-row-left">
        <div className="settings-row-label">{label}</div>
        {description && <div className="settings-row-description">{description}</div>}
      </div>
      <div className="settings-row-right">{control}</div>
    </div>
  );
}
