import { BrowserBridge, AppInfo } from "./BrowserBridge";

/*
This file contains REAL implementations that call Chromium Mojo bindings.
Methods throw NotImplementedError until their corresponding .mojom interface is created.
Never return mock/fake data from this file — see BrowserBridge.mock.ts for development data.
*/

export class RealBrowserBridge implements BrowserBridge {
  public getAppInfo(): Promise<AppInfo> {
    throw new Error(
      "BrowserBridge.real: getAppInfo requires the AppInfo Mojo interface, not yet implemented. See batch-08 prompts.",
    );
  }
}
