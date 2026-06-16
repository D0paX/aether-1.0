import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Clock, Bookmark } from "lucide-react";
import { AutocompleteSuggestion } from "../../../shared/types/navigation";

interface AutocompleteDropdownProps {
  suggestions: AutocompleteSuggestion[];
  selectedIndex: number;
  onSelect: (suggestion: AutocompleteSuggestion) => void;
}

export function AutocompleteDropdown({ 
  suggestions, 
  selectedIndex, 
  onSelect 
}: AutocompleteDropdownProps): React.JSX.Element | null {
  if (suggestions.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="autocomplete-dropdown"
        initial={{ opacity: 0, y: -4, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -4, scale: 0.98 }}
        transition={{ duration: 0.12, ease: [0.4, 0, 0.2, 1] }}
        onMouseDown={(e) => e.preventDefault()}
      >
        {suggestions.map((suggestion, index) => {
          const isSelected = index === selectedIndex;
          
          let Icon = Search;
          if (suggestion.type === "url" || suggestion.type === "history") {
            Icon = Clock;
          } else if (suggestion.type === "bookmark") {
            Icon = Bookmark;
          }

          return (
            <div
              key={suggestion.id}
              className={`suggestion-row ${isSelected ? "selected" : ""}`}
              onClick={() => onSelect(suggestion)}
            >
              <div className="suggestion-icon">
                <Icon size={16} />
              </div>
              <div className="suggestion-title">
                {suggestion.title}
              </div>
              {suggestion.description && (
                <div className="suggestion-description">
                  {suggestion.description}
                </div>
              )}
            </div>
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
}
