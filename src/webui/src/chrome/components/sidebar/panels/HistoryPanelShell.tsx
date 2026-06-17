import React from "react";
import { Globe } from "lucide-react";
import { navigationStore } from "../../../store/navigationStore";
import "./Panels.css";

// Shell only — real data from HistoryService in Batch 13
const MOCK_HISTORY = [
  { title: "GitHub", url: "github.com", time: "2m ago" },
  { title: "Figma", url: "figma.com", time: "15m ago" },
  { title: "Linear", url: "linear.app", time: "1h ago" },
  { title: "Vercel", url: "vercel.com", time: "2h ago" },
  { title: "Docs", url: "docs.anthropic.com", time: "3h ago" },
];

export function HistoryPanelShell(): React.JSX.Element {
  return (
    <div className="panel-root">
      <div className="panel-section-label">RECENT</div>
      {MOCK_HISTORY.map((item, index) => (
        <div
          key={index}
          className="panel-item"
          onClick={() => void navigationStore.getState().navigate("https://" + item.url)}
        >
          <div className="panel-item-icon">
            <Globe size={16} />
          </div>
          <div className="panel-item-content">
            <div className="panel-item-title">{item.title}</div>
            <div className="panel-item-url">{item.url}</div>
          </div>
          <div className="panel-item-right">{item.time}</div>
        </div>
      ))}
    </div>
  );
}
