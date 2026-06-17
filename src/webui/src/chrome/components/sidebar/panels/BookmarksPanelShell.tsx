import React from "react";
import { Globe } from "lucide-react";
import { navigationStore } from "../../../store/navigationStore";
import "./Panels.css";

// Shell only — real data from BookmarkModel in Batch 13
const MOCK_BOOKMARKS = [
  { id: 1, title: "GitHub",      url: "https://github.com" },
  { id: 2, title: "Docs",        url: "https://docs.anthropic.com" },
  { id: 3, title: "Figma",       url: "https://figma.com" },
  { id: 4, title: "Linear",      url: "https://linear.app" },
  { id: 5, title: "Vercel",      url: "https://vercel.com" },
];

export function BookmarksPanelShell(): React.JSX.Element {
  return (
    <div className="panel-root">
      <div className="panel-section-label">BOOKMARKS</div>
      {MOCK_BOOKMARKS.map((bookmark) => (
        <div
          key={bookmark.id}
          className="panel-item"
          onClick={() => void navigationStore.getState().navigate(bookmark.url)}
        >
          <div className="panel-item-icon">
            <Globe size={16} />
          </div>
          <div className="panel-item-content">
            <div className="panel-item-title">{bookmark.title}</div>
            <div className="panel-item-url">{bookmark.url}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
