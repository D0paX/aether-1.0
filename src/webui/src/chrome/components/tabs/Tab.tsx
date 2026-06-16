/* eslint-disable no-restricted-syntax */
import React from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { AetherTab } from '../../../shared/types/tabs';
import './Tab.css';

interface TabProps {
  tab: AetherTab;
  onActivate: (id: number) => void;
  onClose: (id: number) => void;
}

const TAB_HEIGHT = 34;
const TAB_MIN_WIDTH = 100;
const TAB_MAX_WIDTH = 240;
const PINNED_TAB_WIDTH = 44;

export const Tab = React.forwardRef<HTMLDivElement, TabProps>(({ tab, onActivate, onClose }, ref) => {
  const rootClasses = `aether-tab ${tab.isActive ? 'aether-tab--active' : ''}`;

  return (
    <motion.div
      ref={ref}
      layout="position"
      transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
      className={rootClasses}
      onClick={() => onActivate(tab.id)}
      style={{
        height: TAB_HEIGHT,
        minWidth: tab.isPinned ? PINNED_TAB_WIDTH : TAB_MIN_WIDTH,
        maxWidth: tab.isPinned ? PINNED_TAB_WIDTH : TAB_MAX_WIDTH,
        flex: tab.isPinned ? `0 0 ${PINNED_TAB_WIDTH}px` : '1 1 160px',
        borderRadius: "var(--radius-md) var(--radius-md) 0 0",
        borderWidth: tab.isActive ? "1px 1px 0 1px" : "0",
        borderStyle: "solid",
        borderColor: "var(--color-border)",
        boxShadow: tab.isActive ? "var(--shadow-sm)" : "none",
        zIndex: tab.isActive ? 1 : 0,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "var(--space-2)",
        padding: "0 var(--space-2)",
        cursor: "default",
        boxSizing: "border-box",
        transition: "background var(--duration-fast) var(--ease-standard)",
        ...(tab.isActive ? { background: "var(--color-surface-elevated)" } : {})
      }}
    >
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {tab.isLoading ? (
          <div
            className="animate-spin"
            style={{
              width: 14,
              height: 14,
              border: "2px solid var(--color-border)",
              borderTop: "2px solid var(--color-accent)",
              borderRadius: "9999px",
              boxSizing: "border-box",
            }}
          />
        ) : tab.faviconUrl ? (
          <img
            src={tab.faviconUrl}
            width={16}
            height={16}
            style={{ borderRadius: "var(--radius-sm)" }}
            alt=""
          />
        ) : (
          <div
            style={{
              width: 16,
              height: 16,
              background: "var(--color-border-strong)",
              borderRadius: "var(--radius-sm)",
            }}
          />
        )}
      </div>

      {!tab.isPinned && (
        <span
          style={{
            flex: 1,
            minWidth: 0,
            fontSize: "var(--font-size-sm)",
            fontWeight: "var(--font-weight-medium)",
            color: tab.isActive ? "var(--color-text-primary)" : "var(--color-text-secondary)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "block",
            userSelect: "none",
          }}
        >
          {tab.title}
        </span>
      )}

      {!tab.isPinned && (
        <button
          className="aether-tab-close"
          onClick={(e) => {
            e.stopPropagation();
            onClose(tab.id);
          }}
          style={{
            flexShrink: 0,
            width: 16,
            height: 16,
            borderRadius: "9999px",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            cursor: "default",
            color: "var(--color-text-tertiary)",
            opacity: tab.isActive ? 1 : 0,
            transition: "opacity var(--duration-fast), background var(--duration-fast)",
          }}
        >
          <X size={9} strokeWidth={2.5} />
        </button>
      )}
    </motion.div>
  );
});

Tab.displayName = 'Tab';
