import React from "react";
import { useTheme } from "./chrome/hooks/useTheme";
import TitleBar from "./chrome/components/titlebar/TitleBar";

/*
Root application shell. Layout structure expands
in Batch 07 (Browser Chrome Structure).
*/
export default function App(): React.JSX.Element {
  useTheme();

  return (
    <div className="app-shell">
      <TitleBar />
      <div className="app-content">
        <span className="app-placeholder">Aether</span>
      </div>
    </div>
  );
}
