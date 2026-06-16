import React, { useRef } from "react";
import { Loader2 } from "lucide-react";
import { useNavigation } from "../../hooks/useNavigation";
import { navigationStore } from "../../store/navigationStore";
import { SecurityIndicator } from "./SecurityIndicator";
import { LoadingBar } from "./LoadingBar";
import { AutocompleteDropdown } from "./AutocompleteDropdown";
import { getMockSuggestions } from "../../services/mockSuggestions";
import { AutocompleteSuggestion } from "../../../shared/types/navigation";
import "./AddressBar.css";

export default function AddressBar(): React.JSX.Element {
  const { currentState, inputValue, isEditing, suggestions, selectedSuggestionIndex } = useNavigation();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = (): void => {
    navigationStore.getState().startEditing();
    setTimeout(() => {
      inputRef.current?.select();
    }, 0);
  };

  const handleBlur = (): void => {
    navigationStore.getState().stopEditing();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      navigationStore.getState().setSelectedIndex(
        Math.min(selectedSuggestionIndex + 1, suggestions.length - 1)
      );
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      navigationStore.getState().setSelectedIndex(
        Math.max(selectedSuggestionIndex - 1, -1)
      );
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
        void navigationStore.getState().navigate(suggestions[selectedSuggestionIndex].url);
      } else {
        void navigationStore.getState().navigate(inputValue);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      navigationStore.getState().stopEditing();
      inputRef.current?.blur();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const val = e.target.value;
    navigationStore.getState().setInputValue(val);
    const newSuggestions = getMockSuggestions(val);
    navigationStore.getState().setSuggestions(newSuggestions);
    navigationStore.getState().setSelectedIndex(-1);
  };

  const handleSelectSuggestion = (suggestion: AutocompleteSuggestion): void => {
    void navigationStore.getState().navigate(suggestion.url);
  };

  return (
    <div className={`address-bar-container ${isEditing ? "is-editing" : ""}`}>
      <SecurityIndicator level={currentState?.securityLevel ?? "none"} />
      
      <input
        ref={inputRef}
        type="text"
        className="address-bar-input"
        value={inputValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder="Search or enter address"
        spellCheck={false}
      />

      <div 
        className={`address-bar-spinner ${currentState?.isLoading ? "visible" : "hidden"}`} 
      >
        <Loader2 size={14} className="spinner-rotate" />
      </div>

      {isEditing && (
        <AutocompleteDropdown 
          suggestions={suggestions} 
          selectedIndex={selectedSuggestionIndex} 
          onSelect={handleSelectSuggestion} 
        />
      )}

      <LoadingBar 
        progress={currentState?.loadProgress ?? 0} 
        isLoading={currentState?.isLoading ?? false} 
      />
    </div>
  );
}
