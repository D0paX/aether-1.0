import { createAetherStore } from "./createAetherStore";
import { browserBridge } from "../services";
import { NavigationState, AutocompleteSuggestion } from "../../shared/types/navigation";

export interface NavigationStore {
  currentState: NavigationState | null;
  inputValue: string;
  isEditing: boolean;
  isInitialized: boolean;
  suggestions: AutocompleteSuggestion[];
  selectedSuggestionIndex: number;

  initialize: () => Promise<void>;
  navigate: (input: string) => Promise<void>;
  goBack: () => void;
  goForward: () => void;
  reload: () => void;
  stop: () => void;
  startEditing: () => void;
  stopEditing: () => void;
  setInputValue: (value: string) => void;
  setSuggestions: (suggestions: AutocompleteSuggestion[]) => void;
  setSelectedIndex: (index: number) => void;
  clearSuggestions: () => void;
}

export const navigationStore = createAetherStore<NavigationStore>(
  (set, get) => ({
    currentState: null,
    inputValue: "",
    isEditing: false,
    isInitialized: false,
    suggestions: [],
    selectedSuggestionIndex: -1,

    initialize: async () => {
      const state = get();
      if (state.isInitialized) return;

      const navState = await browserBridge.navigation.getNavigationState();
      
      set({ 
        currentState: navState,
        inputValue: navState.displayUrl
      });

      browserBridge.navigation.onNavigationStateChanged((newState) => {
        set({ currentState: newState });
        if (!get().isEditing) {
          set({ inputValue: newState.displayUrl });
        }
      });

      browserBridge.navigation.onLoadProgressChanged((progress) => {
        set((state) => ({
          currentState: state.currentState
            ? { ...state.currentState, loadProgress: progress }
            : null
        }));
      });

      set({ isInitialized: true });
    },

    navigate: async (input: string) => {
      await browserBridge.navigation.navigate(input);
      set({ 
        isEditing: false,
        suggestions: [],
        selectedSuggestionIndex: -1 
      });
    },

    goBack: () => {
      void browserBridge.navigation.goBack();
    },

    goForward: () => {
      void browserBridge.navigation.goForward();
    },

    reload: () => {
      void browserBridge.navigation.reload();
    },

    stop: () => {
      void browserBridge.navigation.stop();
    },

    startEditing: () => {
      const { currentState } = get();
      set({
        isEditing: true,
        inputValue: currentState?.url ?? "",
        suggestions: [],
        selectedSuggestionIndex: -1
      });
    },

    stopEditing: () => {
      const { currentState } = get();
      set({
        isEditing: false,
        inputValue: currentState?.displayUrl ?? "",
        suggestions: [],
        selectedSuggestionIndex: -1
      });
    },

    setInputValue: (value: string) => {
      set({ inputValue: value });
    },

    setSuggestions: (suggestions: AutocompleteSuggestion[]) => {
      set({ suggestions });
    },

    setSelectedIndex: (index: number) => {
      set({ selectedSuggestionIndex: index });
    },

    clearSuggestions: () => {
      set({ suggestions: [], selectedSuggestionIndex: -1 });
    }
  }),
  "navigation-store"
);
