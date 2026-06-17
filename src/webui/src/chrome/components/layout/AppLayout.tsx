import React from "react";
import { useUIStore } from "../../store/uiStore";
import TitleBar from "../titlebar/TitleBar";
import { TabBar } from "../tabs/TabBar";
import { NavControls } from "../toolbar/NavControls";
import AddressBar from "../addressbar/AddressBar";
import { ToolbarActions } from "../toolbar/ToolbarActions";
import { BookmarksBar } from "../toolbar/BookmarksBar";
import { Sidebar } from "../sidebar/Sidebar";
import ViewportRegion from "../../../shared/components/ViewportRegion";
import { StatusBar } from "../statusbar/StatusBar";
import "./AppLayout.css";

export default function AppLayout(): React.JSX.Element {
  const bookmarksBarVisible = useUIStore((state) => state.bookmarksBarVisible);

  return (
    <div className="app-layout">
      {/* 1. TitleBar */}
      <TitleBar />
      <TabBar />

      {/* 2. BookmarksBarRow */}
      {bookmarksBarVisible && (
        <div className="bookmarks-bar-row">
          <BookmarksBar />
        </div>
      )}

      {/* 3. ChromeToolbarRow */}
      <div className="chrome-toolbar-row">
        <div className="nav-controls-region">
          <NavControls />
        </div>
        <div className="address-bar-region">
          <AddressBar />
        </div>
        <div className="toolbar-actions-region">
          <ToolbarActions />
        </div>
      </div>

      {/* 4. MainRow */}
      <div className="main-row">
        <Sidebar />

        <div className="viewport-region">
          <ViewportRegion />
        </div>
      </div>

      {/* 5. StatusBarRow */}
      <div className="status-bar-row">
        <StatusBar />
      </div>
    </div>
  );
}
