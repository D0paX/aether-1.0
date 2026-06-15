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
}
