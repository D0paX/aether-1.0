import { useEffect } from "react";
import { tabsStore } from "../store/tabsStore";

export function useTabKeyboard(): void {
  useEffect(() => {
    const handler = (e: KeyboardEvent): void => {
      if (!e.ctrlKey) return;

      const target = e.target as HTMLElement;
      const isInputting =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      const { tabs, activeTabId } = tabsStore.getState();

      switch (e.key) {
        case "t":
          if (!isInputting) {
            e.preventDefault();
            void tabsStore.getState().createTab();
          }
          break;
        case "w":
          if (!isInputting && activeTabId !== null) {
            e.preventDefault();
            void tabsStore.getState().closeTab(activeTabId);
          }
          break;
        case "Tab":
          if (!isInputting && tabs.length > 1) {
            e.preventDefault();
            const currentIndex = tabs.findIndex((t) => t.id === activeTabId);
            const next = e.shiftKey
              ? (currentIndex - 1 + tabs.length) % tabs.length
              : (currentIndex + 1) % tabs.length;
            if (tabs[next]) {
              void tabsStore.getState().activateTab(tabs[next].id);
            }
          }
          break;
        default:
          if (!isInputting && e.key >= "1" && e.key <= "9") {
            e.preventDefault();
            const index =
              e.key === "9"
                ? tabs.length - 1
                : Math.min(parseInt(e.key, 10) - 1, tabs.length - 1);
            if (tabs[index]) {
              void tabsStore.getState().activateTab(tabs[index].id);
            }
          }
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);
}
