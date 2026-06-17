import React from "react";
import { navigationStore } from "../../store/navigationStore";
import { tabsStore } from "../../store/tabsStore";
import "./StatusBar.css";

export function StatusBar(): React.JSX.Element {
  const currentState = navigationStore((state) => state.currentState);
  const tabs = tabsStore((state) => state.tabs);

  const securityMap = {
    secure: "Secure",
    warning: "Not Secure",
    dangerous: "Dangerous",
    none: "",
  } as const;

  const securityLevel = currentState?.securityLevel || "none";
  const showSecurity = securityLevel !== "none";

  return (
    <div className="statusbar-container">
      <div className="statusbar-left">
        {currentState?.isLoading && (
          <span className="statusbar-loading-text">
            {currentState.url ? `Loading ${currentState.url}...` : "Loading..."}
          </span>
        )}
      </div>

      <div className="statusbar-center">
        {showSecurity && (
          <>
            <div className={`statusbar-security-dot ${securityLevel}`} />
            <span className={`statusbar-security-text ${securityLevel}`}>
              {securityMap[securityLevel]}
            </span>
          </>
        )}
      </div>

      <div className="statusbar-right">
        <span className="statusbar-tab-count">
          {tabs.length} tab{tabs.length !== 1 ? "s" : ""}
        </span>
        <div className="statusbar-separator" />
        <span className="statusbar-version">Aether</span>
      </div>
    </div>
  );
}
