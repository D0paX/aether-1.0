import { BrowserBridge, AppInfo } from "./BrowserBridge";
import { AetherTab, AetherTabGroup, TabsChangedCallback, TabUpdatedCallback, ActiveTabChangedCallback } from "../../shared/types/tabs";
import { NavigationState, NavigationStateCallback, LoadProgressCallback } from "../../shared/types/navigation";

/*
Mock implementations for standalone WebUI development (pnpm dev).
These are NEVER bundled into the production browser build — see vite.config.ts define block.
*/

export class MockBrowserBridge implements BrowserBridge {
  private mockIsMaximized = false;
  private onMaximizedListeners = new Set<(isMaximized: boolean) => void>();

  private mockTabs: AetherTab[] = [
    { id: 1, title: "New Tab", url: "", faviconUrl: "", isActive: true,
      isPinned: false, isSleeping: false, isLoading: false, groupId: -1 },
    { id: 2, title: "GitHub", url: "https://github.com", faviconUrl: "",
      isActive: false, isPinned: false, isSleeping: false, isLoading: false,
      groupId: -1 },
  ];
  private mockNextId = 3;
  private mockTabsCallbacks = new Set<TabsChangedCallback>();
  private mockUpdatedCallbacks = new Set<TabUpdatedCallback>();
  private mockActiveCallbacks = new Set<ActiveTabChangedCallback>();

  private mockNavState: NavigationState = {
    url: "chrome://newtab/",
    displayUrl: "",
    title: "New Tab",
    securityLevel: "none",
    canGoBack: false,
    canGoForward: false,
    isLoading: false,
    loadProgress: 0,
  };
  private mockNavCallbacks = new Set<NavigationStateCallback>();
  private mockLoadProgressCallbacks = new Set<LoadProgressCallback>();

  private notifyNavChanged(): void {
    this.mockNavCallbacks.forEach(cb => cb({ ...this.mockNavState }));
  }

  private notifyTabsChanged(): void {
    this.mockTabsCallbacks.forEach(cb => cb([...this.mockTabs]));
  }

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

  public tabs = {
    getAllTabs: (): Promise<AetherTab[]> => {
      return Promise.resolve([...this.mockTabs]);
    },
    getAllTabGroups: (): Promise<AetherTabGroup[]> => {
      return Promise.resolve([]);
    },
    createTab: (url?: string): Promise<number> => {
      const newId = this.mockNextId++;
      const newTab: AetherTab = {
        id: newId,
        title: url ? url : "New Tab",
        url: url || "",
        faviconUrl: "",
        isActive: false,
        isPinned: false,
        isSleeping: false,
        isLoading: false,
        groupId: -1
      };
      this.mockTabs.push(newTab);
      void this.tabs.activateTab(newId);
      return Promise.resolve(newId);
    },
    closeTab: (tabId: number): Promise<void> => {
      const index = this.mockTabs.findIndex(t => t.id === tabId);
      if (index === -1) return Promise.resolve();
      
      const wasActive = this.mockTabs[index]!.isActive;
      this.mockTabs.splice(index, 1);
      
      if (wasActive && this.mockTabs.length > 0) {
        void this.tabs.activateTab(this.mockTabs[this.mockTabs.length - 1]!.id);
      } else {
        this.notifyTabsChanged();
      }
      return Promise.resolve();
    },
    activateTab: (tabId: number): Promise<void> => {
      this.mockTabs.forEach(t => {
        t.isActive = (t.id === tabId);
      });
      this.notifyTabsChanged();
      this.mockActiveCallbacks.forEach(cb => cb(tabId));
      return Promise.resolve();
    },
    moveTab: (tabId: number, newIndex: number): Promise<void> => {
      const index = this.mockTabs.findIndex(t => t.id === tabId);
      if (index !== -1) {
        const [tab] = this.mockTabs.splice(index, 1);
        this.mockTabs.splice(newIndex, 0, tab!);
        this.notifyTabsChanged();
      }
      return Promise.resolve();
    },
    setTabPinned: (tabId: number, pinned: boolean): Promise<void> => {
      const tab = this.mockTabs.find(t => t.id === tabId);
      if (tab) {
        tab.isPinned = pinned;
        this.notifyTabsChanged();
        this.mockUpdatedCallbacks.forEach(cb => cb({...tab}));
      }
      return Promise.resolve();
    },
    duplicateTab: (tabId: number): Promise<number> => {
      const tab = this.mockTabs.find(t => t.id === tabId);
      if (tab) {
        return this.tabs.createTab(tab.url);
      }
      return Promise.resolve(-1);
    },
    onTabsChanged: (cb: TabsChangedCallback) => {
      this.mockTabsCallbacks.add(cb);
      return () => this.mockTabsCallbacks.delete(cb);
    },
    onTabUpdated: (cb: TabUpdatedCallback) => {
      this.mockUpdatedCallbacks.add(cb);
      return () => this.mockUpdatedCallbacks.delete(cb);
    },
    onActiveTabChanged: (cb: ActiveTabChangedCallback) => {
      this.mockActiveCallbacks.add(cb);
      return () => this.mockActiveCallbacks.delete(cb);
    }
  };

  public navigation = {
    navigate: (input: string): Promise<void> => {
      if (input.includes(".")) {
        this.mockNavState.url = input.startsWith("http") ? input : `https://${input}`;
        this.mockNavState.displayUrl = input;
        this.mockNavState.securityLevel = "secure";
        this.mockNavState.title = input;
      } else {
        this.mockNavState.url = `https://www.google.com/search?q=${encodeURIComponent(input)}`;
        this.mockNavState.displayUrl = "google.com";
        this.mockNavState.securityLevel = "secure";
        this.mockNavState.title = "Search: " + input;
      }
      this.mockNavState.canGoBack = true;
      this.notifyNavChanged();
      return Promise.resolve();
    },
    goBack: (): Promise<void> => {
      this.mockNavState.canGoBack = false;
      this.mockNavState.canGoForward = true;
      this.notifyNavChanged();
      return Promise.resolve();
    },
    goForward: (): Promise<void> => {
      this.mockNavState.canGoForward = false;
      this.mockNavState.canGoBack = true;
      this.notifyNavChanged();
      return Promise.resolve();
    },
    reload: (): Promise<void> => {
      this.notifyNavChanged();
      return Promise.resolve();
    },
    stop: (): Promise<void> => {
      this.notifyNavChanged();
      return Promise.resolve();
    },
    getNavigationState: (): Promise<NavigationState> => {
      return Promise.resolve({ ...this.mockNavState });
    },
    onNavigationStateChanged: (cb: NavigationStateCallback) => {
      this.mockNavCallbacks.add(cb);
      return () => this.mockNavCallbacks.delete(cb);
    },
    onLoadProgressChanged: (cb: LoadProgressCallback) => {
      this.mockLoadProgressCallbacks.add(cb);
      return () => this.mockLoadProgressCallbacks.delete(cb);
    }
  };
}
