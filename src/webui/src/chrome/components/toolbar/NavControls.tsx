import React from "react";
import { ChevronLeft, ChevronRight, X, RotateCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigation } from "../../hooks/useNavigation";
import { navigationStore } from "../../store/navigationStore";
import "./toolbarButton.css";
import "./NavControls.css";

export function NavControls(): React.JSX.Element {
  const { currentState } = useNavigation();

  const handleBack = (): void => {
    navigationStore.getState().goBack();
  };

  const handleForward = (): void => {
    navigationStore.getState().goForward();
  };

  const handleReload = (): void => {
    navigationStore.getState().reload();
  };

  const handleStop = (): void => {
    navigationStore.getState().stop();
  };

  const canGoBack = currentState?.canGoBack ?? false;
  const canGoForward = currentState?.canGoForward ?? false;
  const isLoading = currentState?.isLoading ?? false;

  return (
    <div className="nav-controls-container">
      <button 
        className="toolbar-btn" 
        onClick={handleBack} 
        disabled={!canGoBack}
      >
        <ChevronLeft size={16} />
      </button>

      <button 
        className="toolbar-btn" 
        onClick={handleForward} 
        disabled={!canGoForward}
      >
        <ChevronRight size={16} />
      </button>

      <button 
        className="toolbar-btn" 
        onClick={isLoading ? handleStop : handleReload}
        title={isLoading ? "Stop loading" : "Reload page"}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.span
              key="stop"
              initial={{ opacity: 0, scale: 0.7, rotate: 0 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.12 }}
              className="nav-icon-wrapper"
            >
              <X size={15} />
            </motion.span>
          ) : (
            <motion.span
              key="reload"
              initial={{ opacity: 0, scale: 0.7, rotate: -30 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.12 }}
              className="nav-icon-wrapper"
            >
              <RotateCw size={14} />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
