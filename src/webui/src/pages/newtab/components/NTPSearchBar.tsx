import React, { useState, RefObject } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { browserBridge } from "../../../chrome/services";
import "./NTPSearchBar.css";

interface NTPSearchBarProps {
  inputRef?: RefObject<HTMLInputElement | null>;
}

export function NTPSearchBar({ inputRef }: NTPSearchBarProps): React.JSX.Element {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSubmit = (): void => {
    if (!query.trim()) return;
    void browserBridge.navigation.navigate(query.trim());
    setQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      setQuery("");
      e.currentTarget.blur();
    }
  };

  return (
    <motion.div
      className="ntp-search-container"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <Search
        className={`ntp-search-icon ${focused ? "focused" : ""}`}
        size={18}
      />
      <input
        ref={inputRef}
        className={`ntp-search-input ${focused ? "focused" : ""}`}
        type="text"
        placeholder="Search the web or enter a URL"
        value={query}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </motion.div>
  );
}
