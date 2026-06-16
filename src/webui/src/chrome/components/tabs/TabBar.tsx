/* eslint-disable no-restricted-syntax */
import React, { useEffect, useRef } from 'react';
import { Plus } from 'lucide-react';
import { useTabs } from '../../hooks/useTabs';
import { tabsStore, selectPinnedTabs, selectUnpinnedTabs } from '../../store/tabsStore';
import { Tab } from './Tab';

const TABBAR_HEIGHT = 38;

export const TabBar = (): React.JSX.Element => {
  const { tabs, activeTabId } = useTabs();
  const pinnedTabs = selectPinnedTabs(tabs);
  const unpinnedTabs = selectUnpinnedTabs(tabs);
  const orderedTabs = [...pinnedTabs, ...unpinnedTabs];

  const activeTabRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void tabsStore.getState().initialize();
  }, []);

  useEffect(() => {
    activeTabRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest"
    });
  }, [activeTabId]);

  return (
    <div
      style={{
        height: TABBAR_HEIGHT,
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        overflowX: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        padding: "0 8px",
        gap: 2,
        background: "var(--color-surface)",
        backdropFilter: "blur(var(--blur-md))",
        borderBottom: "1px solid var(--color-border)",
      }}
      className="aether-tabbar"
    >
      <style>{`.aether-tabbar::-webkit-scrollbar { display: none; }`}</style>
      
      {orderedTabs.map(tab => (
        <Tab
          key={tab.id}
          tab={tab}
          ref={tab.isActive ? activeTabRef : null}
          onActivate={(id) => { void tabsStore.getState().activateTab(id); }}
          onClose={(id) => { void tabsStore.getState().closeTab(id); }}
        />
      ))}

      <button
        onClick={() => void tabsStore.getState().createTab()}
        style={{
          width: 28,
          height: 28,
          borderRadius: "9999px",
          border: "none",
          background: "transparent",
          color: "var(--color-text-secondary)",
          alignSelf: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "default",
          transition: "background var(--duration-fast)",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-hover-overlay)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <Plus size={14} />
      </button>
    </div>
  );
};
