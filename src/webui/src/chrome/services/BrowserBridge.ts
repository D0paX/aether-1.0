import { AetherTab, AetherTabGroup, TabsChangedCallback, TabUpdatedCallback, ActiveTabChangedCallback, UnsubscribeFn } from "../../shared/types/tabs";

export interface AppInfo {
  version: string;
  platform: "windows" | "android";
  isDevelopment: boolean;
}

/**
 * The central service registry for all WebUI-to-browser process communication.
 *
 * Example of future extended structure:
 * interface BrowserBridge {
 *   tabs: TabsService;
 *   navigation: NavigationService;
 *   bookmarks: BookmarksService;
 *   getAppInfo(): Promise<AppInfo>;
 * }
 */
export interface BrowserBridge {
  getAppInfo(): Promise<AppInfo>;
  windowControls: {
    minimize(): Promise<void>;
    maximize(): Promise<void>;
    restore(): Promise<void>;
    close(): Promise<void>;
    isMaximized(): Promise<boolean>;
    onMaximizedStateChanged(callback: (isMaximized: boolean) => void): () => void;
  };
  tabs: {
    getAllTabs(): Promise<AetherTab[]>;
    getAllTabGroups(): Promise<AetherTabGroup[]>;
    createTab(url?: string): Promise<number>;
    closeTab(tabId: number): Promise<void>;
    activateTab(tabId: number): Promise<void>;
    moveTab(tabId: number, newIndex: number): Promise<void>;
    setTabPinned(tabId: number, pinned: boolean): Promise<void>;
    duplicateTab(tabId: number): Promise<number>;
    onTabsChanged(cb: TabsChangedCallback): UnsubscribeFn;
    onTabUpdated(cb: TabUpdatedCallback): UnsubscribeFn;
    onActiveTabChanged(cb: ActiveTabChangedCallback): UnsubscribeFn;
  };
}
