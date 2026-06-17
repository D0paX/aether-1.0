import React from "react";
import "./ViewportRegion.css";

/**
 * ViewportRegion component.
 * This is NOT rendered by React. It is managed by Chromium's native view hierarchy.
 * Only this React-rendered region defines its boundaries.
 */
export function ViewportRegion(): React.JSX.Element {
  return (
    <div className="viewport-region-content">
      <span>Web content renders here (native Chromium region)</span>
    </div>
  );
}

export default ViewportRegion;
