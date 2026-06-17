import React from "react";
import { useUIStore } from "../../store/uiStore";
import { navigationStore } from "../../store/navigationStore";
import "./BookmarksBar.css";

// Mock data — replaced with real BookmarkModel data in Batch 13
const MOCK_BOOKMARKS = [
  { id: 1, title: "GitHub",      url: "https://github.com" },
  { id: 2, title: "Docs",        url: "https://docs.anthropic.com" },
  { id: 3, title: "Figma",       url: "https://figma.com" },
  { id: 4, title: "Linear",      url: "https://linear.app" },
  { id: 5, title: "Vercel",      url: "https://vercel.com" },
];

export function BookmarksBar(): React.JSX.Element | null {
  const bookmarksBarVisible = useUIStore((state) => state.bookmarksBarVisible);

  if (!bookmarksBarVisible) {
    return null;
  }

  return (
    <div className="bookmarks-bar-container">
      {MOCK_BOOKMARKS.map((bookmark) => (
        <div
          key={bookmark.id}
          className="bookmark-item"
          onClick={() => void navigationStore.getState().navigate(bookmark.url)}
          title={bookmark.title}
        >
          <div className="bookmark-favicon" />
          <span>{bookmark.title}</span>
        </div>
      ))}
    </div>
  );
}
