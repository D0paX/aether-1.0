import { tabsStore, selectPinnedTabs } from '../store/tabsStore';

import { AetherTab, AetherTabGroup } from '../../shared/types/tabs';

import { useShallow } from 'zustand/react/shallow';

export function useTabs(): { tabs: AetherTab[], activeTabId: number | null, groups: AetherTabGroup[], isInitialized: boolean } {
  return tabsStore(useShallow(state => ({
    tabs: state.tabs,
    activeTabId: state.activeTabId,
    groups: state.groups,
    isInitialized: state.isInitialized,
  })));
}

export function useActiveTabId(): number | null {
  return tabsStore(state => state.activeTabId);
}

export function usePinnedTabs(): AetherTab[] {
  return tabsStore(state => selectPinnedTabs(state.tabs));
}
