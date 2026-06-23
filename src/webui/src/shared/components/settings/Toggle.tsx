import React from "react";
import { motion } from "framer-motion";
import "./Toggle.css";

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md";
}

export function Toggle({
  checked,
  onChange,
  disabled = false,
  size = "md",
}: ToggleProps): React.JSX.Element {
  const handleClick = (): void => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const trackClass = `aether-toggle-track aether-toggle-track-${size} ${
    checked ? "checked" : "unchecked"
  } ${disabled ? "disabled" : ""}`;

  return (
    <div
      className={trackClass}
      onClick={handleClick}
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
    >
      <motion.div
        className={`aether-toggle-thumb aether-toggle-thumb-${size}`}
        initial={false}
        animate={{ x: checked ? (size === "sm" ? 12 : 16) : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
      />
    </div>
  );
}
