import { navigationStore } from "../store/navigationStore";
import { NavigationState, AutocompleteSuggestion } from "../../shared/types/navigation";

export interface NavigationHookResult {
  currentState: NavigationState | null;
  inputValue: string;
  isEditing: boolean;
  suggestions: AutocompleteSuggestion[];
  selectedSuggestionIndex: number;
}

export function useNavigation(): NavigationHookResult {
  return navigationStore((state) => ({
    currentState: state.currentState,
    inputValue: state.inputValue,
    isEditing: state.isEditing,
    suggestions: state.suggestions,
    selectedSuggestionIndex: state.selectedSuggestionIndex,
  }));
}
