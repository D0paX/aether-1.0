import { BrowserBridge, AppInfo } from "./BrowserBridge";

/*
Mock implementations for standalone WebUI development (pnpm dev).
These are NEVER bundled into the production browser build — see vite.config.ts define block.
*/

export class MockBrowserBridge implements BrowserBridge {
  private mockIsMaximized = false;
  private onMaximizedListeners = new Set<(isMaximized: boolean) => void>();

  public getAppInfo(): Promise<AppInfo> {
    return Promise.resolve({
      version: "0.1.0-dev",
      platform: "windows",
      isDevelopment: true,
    });
  }

  public windowControls = {
    minimize: (): Promise<void> => {
      console.log("[MockBrowserBridge] Minimize clicked");
      return Promise.resolve();
    },
    maximize: (): Promise<void> => {
      console.log("[MockBrowserBridge] Maximize clicked");
      this.mockIsMaximized = true;
      this.notifyListeners();
      return Promise.resolve();
    },
    restore: (): Promise<void> => {
      console.log("[MockBrowserBridge] Restore clicked");
      this.mockIsMaximized = false;
      this.notifyListeners();
      return Promise.resolve();
    },
    close: (): Promise<void> => {
      console.log("[MockBrowserBridge] Close clicked");
      return Promise.resolve();
    },
    isMaximized: (): Promise<boolean> => {
      return Promise.resolve(this.mockIsMaximized);
    },
    onMaximizedStateChanged: (callback: (isMaximized: boolean) => void): (() => void) => {
      this.onMaximizedListeners.add(callback);
      return () => {
        this.onMaximizedListeners.delete(callback);
      };
    }
  };

  private notifyListeners(): void {
    this.onMaximizedListeners.forEach(listener => listener(this.mockIsMaximized));
  }
}
