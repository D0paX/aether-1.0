export interface AetherTab {
  id: number;
  title: string;
  url: string;
  faviconUrl: string;
  isActive: boolean;
  isPinned: boolean;
  isSleeping: boolean;
  isLoading: boolean;
  groupId: number;
}

export interface AetherTabGroup {
  id: number;
  title: string;
  color: number;
  isCollapsed: boolean;
}

export type TabsChangedCallback = (tabs: AetherTab[]) => void;
export type TabUpdatedCallback = (tab: AetherTab) => void;
export type ActiveTabChangedCallback = (tabId: number) => void;
export type UnsubscribeFn = () => void;
