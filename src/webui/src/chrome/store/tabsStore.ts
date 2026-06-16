import { AetherTab, AetherTabGroup, UnsubscribeFn } from "../../shared/types/tabs";
import { browserBridge } from "../services";
import { createAetherStore } from "./createAetherStore";

export interface TabsState {
  tabs: AetherTab[];
  activeTabId: number | null;
  groups: AetherTabGroup[];
  isInitialized: boolean;
}

export interface TabsActions {
  initialize(): Promise<void>;
  createTab(url?: string): Promise<void>;
  closeTab(tabId: number): Promise<void>;
  activateTab(tabId: number): Promise<void>;
  moveTab(tabId: number, newIndex: number): Promise<void>;
  setTabPinned(tabId: number, pinned: boolean): Promise<void>;
  duplicateTab(tabId: number): Promise<void>;
}

type TabsStore = TabsState & TabsActions;

 
export let unsubscribeFns: UnsubscribeFn[] = [];

export const tabsStore = createAetherStore<TabsStore>(
  (set, get) => ({
    tabs: [],
    activeTabId: null,
    groups: [],
    isInitialized: false,

    initialize: async () => {
      if (get().isInitialized) return;

      const [tabs, groups] = await Promise.all([
        browserBridge.tabs.getAllTabs(),
        browserBridge.tabs.getAllTabGroups(),
      ]);

      const activeTabId = tabs.find(t => t.isActive)?.id ?? null;

      set({ tabs, groups, activeTabId });

      const unsubTabsChanged = browserBridge.tabs.onTabsChanged((newTabs) => {
        set({
          tabs: newTabs,
          activeTabId: newTabs.find(t => t.isActive)?.id ?? null,
        });
      });

      const unsubTabUpdated = browserBridge.tabs.onTabUpdated((updatedTab) => {
        set((state) => ({
          tabs: state.tabs.map(t => t.id === updatedTab.id ? updatedTab : t),
        }));
      });

      const unsubActiveTabChanged = browserBridge.tabs.onActiveTabChanged((tabId) => {
        set({ activeTabId: tabId });
      });

      unsubscribeFns = [unsubTabsChanged, unsubTabUpdated, unsubActiveTabChanged];

      set({ isInitialized: true });
    },

    createTab: async (url?: string) => {
      await browserBridge.tabs.createTab(url ?? "");
    },

    closeTab: async (tabId: number) => {
      await browserBridge.tabs.closeTab(tabId);
    },

    activateTab: async (tabId: number) => {
      // Optimistic update for instant visual feedback
      set((state) => ({
        tabs: state.tabs.map((t) => ({
          ...t,
          isActive: t.id === tabId,
        })),
        activeTabId: tabId,
      }));
      
      await browserBridge.tabs.activateTab(tabId);
    },

    moveTab: async (tabId: number, newIndex: number) => {
      await browserBridge.tabs.moveTab(tabId, newIndex);
    },

    setTabPinned: async (tabId: number, pinned: boolean) => {
      await browserBridge.tabs.setTabPinned(tabId, pinned);
    },

    duplicateTab: async (tabId: number) => {
      await browserBridge.tabs.duplicateTab(tabId);
    },
  }),
  "tabs-store"
);

export const selectActiveTab = (tabs: AetherTab[]): AetherTab | undefined => tabs.find((t) => t.isActive);
export const selectPinnedTabs = (tabs: AetherTab[]): AetherTab[] => tabs.filter((t) => t.isPinned);
export const selectUnpinnedTabs = (tabs: AetherTab[]): AetherTab[] => tabs.filter((t) => !t.isPinned);
