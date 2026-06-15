import { BrowserBridge, AppInfo } from "./BrowserBridge";

/*
Mock implementations for standalone WebUI development (pnpm dev).
These are NEVER bundled into the production browser build — see vite.config.ts define block.
*/

export class MockBrowserBridge implements BrowserBridge {
  public getAppInfo(): Promise<AppInfo> {
    return Promise.resolve({
      version: "0.1.0-dev",
      platform: "windows",
      isDevelopment: true,
    });
  }
}
