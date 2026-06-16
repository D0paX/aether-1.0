/* eslint-disable */
import { AetherTab, AetherTabGroup } from "../../../shared/types/tabs";

export class TabManagerRemote {
  public getAllTabs(): Promise<{ tabs: AetherTab[] }> {
    return Promise.resolve({ tabs: [] });
  }
  public getAllTabGroups(): Promise<{ groups: AetherTabGroup[] }> {
    return Promise.resolve({ groups: [] });
  }
  public createTab(_url: string): Promise<{ tabId: number }> {
    return Promise.resolve({ tabId: -1 });
  }
  public closeTab(_tabId: number): Promise<void> {
    return Promise.resolve();
  }
  public activateTab(_tabId: number): Promise<void> {
    return Promise.resolve();
  }
  public moveTab(_tabId: number, _newIndex: number): Promise<void> {
    return Promise.resolve();
  }
  public setTabPinned(_tabId: number, _pinned: boolean): Promise<void> {
    return Promise.resolve();
  }
  public duplicateTab(_tabId: number): Promise<{ tabId: number }> {
    return Promise.resolve({ tabId: -1 });
  }
  public addObserver(_observer: unknown): Promise<void> {
    return Promise.resolve();
  }
}

export class TabManagerObserverCallbackRouter {
  public onTabsChanged = {
    addListener(_callback: (tabs: AetherTab[]) => void): void {}
  };
  public onTabUpdated = {
    addListener(_callback: (tab: AetherTab) => void): void {}
  };
  public onActiveTabChanged = {
    addListener(_callback: (tabId: number) => void): void {}
  };
  public $ = {
    bindNewPipeAndPassRemote(): unknown {
      return {};
    }
  };
}
