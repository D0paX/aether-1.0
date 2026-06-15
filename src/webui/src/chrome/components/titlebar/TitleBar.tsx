import React from "react";
import WindowControls from "./WindowControls";
import { browserBridge } from "../../services";
import { useWindowMaximizedState } from "../../hooks/useWindowMaximizedState";
import "./TitleBar.css";

/**
 * TitleBar component representing Aether's custom draggable window border.
 * Features centered title branding and Windows window controls.
 */
export function TitleBar(): React.JSX.Element {
  const isMaximized = useWindowMaximizedState();

  const handleDoubleClick = (): void => {
    if (isMaximized) {
      browserBridge.windowControls.restore();
    } else {
      browserBridge.windowControls.maximize();
    }
  };

  return (
    <header className="title-bar">
      {/* Left region: reserved for traffic-light style controls if macOS support is added later */}
      <div className="title-bar-left" />

      {/* Center region: Window drag handle and branding */}
      <div className="title-bar-center" onDoubleClick={handleDoubleClick}>
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
