import { BrowserBridge, AppInfo } from "./BrowserBridge";
import { WindowControlsRemote, WindowControlsObserverCallbackRouter } from "/window_controls.mojom-webui.js";

/*
This file contains REAL implementations that call Chromium Mojo bindings.
Methods throw NotImplementedError until their corresponding .mojom interface is created.
Never return mock/fake data from this file — see BrowserBridge.mock.ts for development data.
*/

export class RealBrowserBridge implements BrowserBridge {
  private windowControlsRemote = new WindowControlsRemote();
  private callbackRouter = new WindowControlsObserverCallbackRouter();
  private onMaximizedListeners = new Set<(isMaximized: boolean) => void>();

  constructor() {
    // Pass the observer callback router remote end to C++ side
    void this.windowControlsRemote.addObserver(
      this.callbackRouter.$.bindNewPipeAndPassRemote()
    );

    // Register callback for maximize state changes
    this.callbackRouter.onMaximizedStateChanged.addListener((isMaximized: boolean) => {
      this.onMaximizedListeners.forEach(listener => listener(isMaximized));
    });
  }

  public getAppInfo(): Promise<AppInfo> {
    throw new Error(
      "BrowserBridge.real: getAppInfo requires the AppInfo Mojo interface, not yet implemented. See batch-08 prompts.",
    );
  }

  public windowControls = {
    minimize: (): Promise<void> => {
      return this.windowControlsRemote.minimize();
    },
    maximize: (): Promise<void> => {
      return this.windowControlsRemote.maximize();
    },
    restore: (): Promise<void> => {
      return this.windowControlsRemote.restore();
    },
    close: (): Promise<void> => {
      return this.windowControlsRemote.close();
    },
    isMaximized: async (): Promise<boolean> => {
      const response = await this.windowControlsRemote.isMaximized();
      return response.isMaximized;
    },
    onMaximizedStateChanged: (callback: (isMaximized: boolean) => void): (() => void) => {
      this.onMaximizedListeners.add(callback);
      return () => {
        this.onMaximizedListeners.delete(callback);
      };
    }
  };
}
