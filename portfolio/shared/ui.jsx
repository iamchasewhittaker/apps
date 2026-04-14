/**
 * /portfolio/shared/ui.jsx
 * Shared UI primitives for all portfolio web apps.
 *
 * Components:
 *   Card      — consistent dark container with border + padding
 *   NavTabs   — horizontal tab bar, underline-style
 *
 * Usage (after copying to src/shared/ui.jsx):
 *   import { Card, NavTabs } from './shared/ui';
 *
 * Override colors via the style prop (Card) or tabStyle/activeTabStyle (NavTabs).
 * Each app defines its own T/s tokens — pass them in rather than hardcoding here.
 */

import React from "react";

// Neutral defaults — individual apps override with their own color tokens
const DEFAULTS = {
  surface: "#1c1c24",
  border: "#2d2d3d",
  text: "#e5e7eb",
  muted: "#9ca3af",
  accent: "#3d9970",
};

/**
 * Card
 *
 * Usage:
 *   <Card>content</Card>
 *   <Card style={{ background: T.elevated, padding: "12px 16px" }}>content</Card>
 */
export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: DEFAULTS.surface,
      border: `1px solid ${DEFAULTS.border}`,
      borderRadius: 12,
      padding: "20px 22px",
      marginBottom: 14,
      ...style,
    }}>
      {children}
    </div>
  );
}

/**
 * NavTabs — underline-style horizontal tab bar.
 *
 * Props:
 *   tabs            [{ key: string, label: string }]
 *   active          string — currently selected key
 *   onSelect        (key: string) => void
 *   containerStyle  optional style override for the wrapper div
 *   tabStyle        optional style for inactive tabs
 *   activeTabStyle  optional style for the active tab
 *
 * Each app passes its own accent color via activeTabStyle:
 *   <NavTabs
 *     tabs={TABS}
 *     active={activeTab}
 *     onSelect={setActiveTab}
 *     activeTabStyle={{ borderBottomColor: "#3b82f6", color: "#f4f4f5" }}
 *   />
 */
export function NavTabs({
  tabs,
  active,
  onSelect,
  containerStyle = {},
  tabStyle = {},
  activeTabStyle = {},
}) {
  return (
    <div style={{
      display: "flex",
      gap: 4,
      marginBottom: 18,
      borderBottom: `1px solid ${DEFAULTS.border}`,
      overflowX: "auto",
      ...containerStyle,
    }}>
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            onClick={() => onSelect(tab.key)}
            style={{
              padding: "8px 16px",
              background: "none",
              border: "none",
              borderBottom: isActive
                ? `2px solid ${DEFAULTS.accent}`
                : "2px solid transparent",
              color: isActive ? DEFAULTS.text : DEFAULTS.muted,
              fontSize: 14,
              fontWeight: isActive ? 600 : 400,
              cursor: "pointer",
              fontFamily: "inherit",
              whiteSpace: "nowrap",
              marginBottom: -1,
              transition: "color 0.15s",
              ...(isActive ? activeTabStyle : tabStyle),
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
