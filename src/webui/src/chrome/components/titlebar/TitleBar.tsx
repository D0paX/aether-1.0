import React from "react";
import WindowControls from "./WindowControls";
import "./TitleBar.css";

export const TITLE_BAR_HEIGHT = "38px";

/**
 * TitleBar component representing Aether's custom draggable window border.
 * Features centered title branding and Windows window controls.
 */
export function TitleBar(): React.JSX.Element {
  return (
    <header className="title-bar">
      {/* Left region: reserved for traffic-light style controls if macOS support is added later */}
      <div className="title-bar-left" />

      {/* Center region: Window drag handle and branding */}
      <div className="title-bar-center">
        <span>Aether</span>
      </div>

      {/* Right region: Window controls */}
      <div className="title-bar-right">
        <WindowControls />
      </div>
    </header>
  );
}

export default TitleBar;
