import { createAetherStore } from "./createAetherStore";

export type SidebarPanel = "bookmarks" | "history" | "downloads" | "ai";
export type Theme = "light" | "dark" | "system";

export interface UIState {
  sidebarOpen: boolean;
  sidebarActivePanel: SidebarPanel | null;
  theme: Theme;
  commandPaletteOpen: boolean;
  bookmarksBarVisible: boolean;
}

export interface UIActions {
  toggleSidebar: () => void;
  setSidebarPanel: (panel: SidebarPanel | null) => void;
  setTheme: (theme: Theme) => void;
  toggleCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleBookmarksBar: () => void;
}

export type UIStore = UIState & UIActions;

export const useUIStore = createAetherStore<UIStore>(
  (set) => ({
    // Initial State
    sidebarOpen: false,
    sidebarActivePanel: null,
    theme: "system",
    commandPaletteOpen: false,
    bookmarksBarVisible: false,

    // Actions
    toggleSidebar: () =>
      set((state) => ({ sidebarOpen: !state.sidebarOpen }), false, "ui/toggleSidebar"),

    setSidebarPanel: (panel) =>
      set(
        {
          sidebarActivePanel: panel,
          sidebarOpen: panel !== null,
        },
        false,
        "ui/setSidebarPanel",
      ),

    setTheme: (theme) => set({ theme }, false, "ui/setTheme"),

    toggleCommandPalette: () =>
      set(
        (state) => ({ commandPaletteOpen: !state.commandPaletteOpen }),
        false,
        "ui/toggleCommandPalette",
      ),

    closeCommandPalette: () => set({ commandPaletteOpen: false }, false, "ui/closeCommandPalette"),

    toggleBookmarksBar: () =>
      set(
        (state) => ({ bookmarksBarVisible: !state.bookmarksBarVisible }),
        false,
        "ui/toggleBookmarksBar",
      ),
  }),
  "ui-store",
);
