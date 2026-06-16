import React from "react";
import { motion } from "motion/react";

interface LoadingBarProps {
  progress: number;
  isLoading: boolean;
}

export function LoadingBar({ progress, isLoading }: LoadingBarProps): React.JSX.Element {
  return (
    <motion.div
      className="loading-bar"
      animate={{ width: isLoading ? `${progress * 100}%` : "0%" }}
      transition={{ duration: isLoading ? 0.15 : 0, ease: "easeOut" }}
    />
  );
}
