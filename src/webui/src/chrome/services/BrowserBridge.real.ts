import { BrowserBridge, AppInfo } from "./BrowserBridge";
import { WindowControlsRemote, WindowControlsObserverCallbackRouter } from "/window_controls.mojom-webui.js";
import { TabManagerRemote, TabManagerObserverCallbackRouter } from "/tab_manager.mojom-webui.js";
import { AetherTab, AetherTabGroup, TabsChangedCallback, TabUpdatedCallback, ActiveTabChangedCallback } from "../../shared/types/tabs";
/*
This file contains REAL implementations that call Chromium Mojo bindings.
Methods throw NotImplementedError until their corresponding .mojom interface is created.
Never return mock/fake data from this file — see BrowserBridge.mock.ts for development data.
*/

export class RealBrowserBridge implements BrowserBridge {
  private windowControlsRemote = new WindowControlsRemote();
  private callbackRouter = new WindowControlsObserverCallbackRouter();
  private onMaximizedListeners = new Set<(isMaximized: boolean) => void>();

  private tabManagerRemote = new TabManagerRemote();
  private tabCallbackRouter = new TabManagerObserverCallbackRouter();
  private tabsCallbacks = new Set<TabsChangedCallback>();
  private tabUpdatedCallbacks = new Set<TabUpdatedCallback>();
  private activeCallbacks = new Set<ActiveTabChangedCallback>();
  private tabObserverAttached = false;

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

  private attachTabObserver(): void {
    if (this.tabObserverAttached) return;
    this.tabObserverAttached = true;
    
    void this.tabManagerRemote.addObserver(
      this.tabCallbackRouter.$.bindNewPipeAndPassRemote()
    );

    this.tabCallbackRouter.onTabsChanged.addListener((tabs: AetherTab[]) => {
      this.tabsCallbacks.forEach(cb => cb(tabs));
    });

    this.tabCallbackRouter.onTabUpdated.addListener((tab: AetherTab) => {
      this.tabUpdatedCallbacks.forEach(cb => cb(tab));
    });

    this.tabCallbackRouter.onActiveTabChanged.addListener((tabId: number) => {
      this.activeCallbacks.forEach(cb => cb(tabId));
    });
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

  public tabs = {
    getAllTabs: async (): Promise<AetherTab[]> => {
      const response = await this.tabManagerRemote.getAllTabs();
      return response.tabs;
    },
    getAllTabGroups: async (): Promise<AetherTabGroup[]> => {
      const response = await this.tabManagerRemote.getAllTabGroups();
      return response.groups;
    },
    createTab: async (url?: string): Promise<number> => {
      const response = await this.tabManagerRemote.createTab(url || "");
      return response.tabId;
    },
    closeTab: async (tabId: number): Promise<void> => {
      return this.tabManagerRemote.closeTab(tabId);
    },
    activateTab: async (tabId: number): Promise<void> => {
      return this.tabManagerRemote.activateTab(tabId);
    },
    moveTab: async (tabId: number, newIndex: number): Promise<void> => {
      return this.tabManagerRemote.moveTab(tabId, newIndex);
    },
    setTabPinned: async (tabId: number, pinned: boolean): Promise<void> => {
      return this.tabManagerRemote.setTabPinned(tabId, pinned);
    },
    duplicateTab: async (tabId: number): Promise<number> => {
      const response = await this.tabManagerRemote.duplicateTab(tabId);
      return response.tabId;
    },
    onTabsChanged: (cb: TabsChangedCallback) => {
      this.attachTabObserver();
      this.tabsCallbacks.add(cb);
      return () => this.tabsCallbacks.delete(cb);
    },
    onTabUpdated: (cb: TabUpdatedCallback) => {
      this.attachTabObserver();
      this.tabUpdatedCallbacks.add(cb);
      return () => this.tabUpdatedCallbacks.delete(cb);
    },
    onActiveTabChanged: (cb: ActiveTabChangedCallback) => {
      this.attachTabObserver();
      this.activeCallbacks.add(cb);
      return () => this.activeCallbacks.delete(cb);
    }
  };
}
