import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useUIStore } from "../../store/uiStore";
import TitleBar from "../titlebar/TitleBar";
import { TabBar } from "../tabs/TabBar";
import NavControlsPlaceholder from "../placeholders/NavControlsPlaceholder";
import AddressBar from "../addressbar/AddressBar";
import ToolbarActionsPlaceholder from "../placeholders/ToolbarActionsPlaceholder";
import BookmarksBarPlaceholder from "../placeholders/BookmarksBarPlaceholder";
import SidebarPlaceholder from "../placeholders/SidebarPlaceholder";
import ViewportPlaceholder from "../../../shared/components/ViewportPlaceholder";
import StatusBarPlaceholder from "../placeholders/StatusBarPlaceholder";
import "./AppLayout.css";

export default function AppLayout(): React.JSX.Element {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const bookmarksBarVisible = useUIStore((state) => state.bookmarksBarVisible);

  return (
    <div className="app-layout">
      {/* 1. TitleBar */}
      <TitleBar />
      <TabBar />

      {/* 2. ChromeToolbarRow */}
      <div className="chrome-toolbar-row">
        <div className="nav-controls-region">
          <NavControlsPlaceholder />
        </div>
        <div className="address-bar-region">
          <AddressBar />
        </div>
        <div className="toolbar-actions-region">
          <ToolbarActionsPlaceholder />
        </div>
      </div>

      {/* 3. BookmarksBarRow */}
      {bookmarksBarVisible && (
        <div className="bookmarks-bar-row">
          <BookmarksBarPlaceholder />
        </div>
      )}

      {/* 4. MainRow */}
      <div className="main-row">
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.div
              className="sidebar-region"
              initial={{ width: 0 }}
              animate={{ width: "var(--width-sidebar)" }}
              exit={{ width: 0 }}
              transition={{
                duration: 0.2, // --duration-base is 200ms
                ease: [0.34, 1.56, 0.64, 1], // --ease-spring-out
              }}
            >
              <SidebarPlaceholder />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="viewport-region">
          <ViewportPlaceholder />
        </div>
      </div>

      {/* 5. StatusBarRow */}
      <div className="status-bar-row">
        <StatusBarPlaceholder />
      </div>
    </div>
  );
}
