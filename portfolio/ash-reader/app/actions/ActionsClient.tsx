"use client";
import { useState, useEffect, useCallback } from "react";
import type { ActionItem } from "./page";
import { isActionDone, markActionDone } from "@/lib/progress";

type Filter = "all" | "incomplete" | "done";

interface Props {
  actions: ActionItem[];
}

export default function ActionsClient({ actions }: Props) {
  const [doneMap, setDoneMap] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    const map: Record<string, boolean> = {};
    for (const a of actions) {
      map[a.id] = isActionDone(a.id);
    }
    setDoneMap(map);
  }, [actions]);

  const toggle = useCallback((id: string) => {
    setDoneMap((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      markActionDone(id, next[id]);
      return next;
    });
  }, []);

  const doneCount = Object.values(doneMap).filter(Boolean).length;

  // Group by theme
  const byTheme = actions.reduce<Record<string, ActionItem[]>>((acc, a) => {
    if (!acc[a.themeId]) acc[a.themeId] = [];
    acc[a.themeId].push(a);
    return acc;
  }, {});

  const themes = Object.keys(byTheme);

  const visible = (item: ActionItem) => {
    if (filter === "all") return true;
    if (filter === "done") return doneMap[item.id];
    return !doneMap[item.id];
  };

  return (
    <div>
      {/* Progress */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 14, color: "#777" }}>
          <span>{doneCount} of {actions.length} complete</span>
          <span style={{ color: "#7c9cff", fontWeight: 600 }}>
            {Math.round((doneCount / actions.length) * 100)}%
          </span>
        </div>
        <div style={{ height: 6, background: "#2e2e2e", borderRadius: 3 }}>
          <div style={{
            height: "100%",
            width: `${(doneCount / actions.length) * 100}%`,
            background: "#6dbf6d",
            borderRadius: 3,
            transition: "width 0.3s",
          }} />
        </div>
      </div>

      {/* Filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {(["all", "incomplete", "done"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              border: "1px solid",
              borderColor: filter === f ? "#7c9cff" : "#2e2e2e",
              background: filter === f ? "#3d4f80" : "transparent",
              color: filter === f ? "#fff" : "#777",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: filter === f ? 600 : 400,
              textTransform: "capitalize",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Actions by theme */}
      {themes.map((themeId) => {
        const items = byTheme[themeId].filter(visible);
        if (!items.length) return null;
        return (
          <div key={themeId} style={{ marginBottom: 28 }}>
            <h2 style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#7c9cff",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 10,
              marginTop: 0,
            }}>
              {items[0].theme}
            </h2>
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => toggle(item.id)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  width: "100%",
                  background: doneMap[item.id] ? "#141f14" : "#1a1a1a",
                  border: "1px solid",
                  borderColor: doneMap[item.id] ? "#2a3a2a" : "#2e2e2e",
                  borderRadius: 10,
                  padding: "12px 14px",
                  marginBottom: 8,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  border: "1.5px solid",
                  borderColor: doneMap[item.id] ? "#6dbf6d" : "#444",
                  background: doneMap[item.id] ? "#6dbf6d" : "transparent",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 2,
                  color: "#000",
                  fontSize: 13,
                  fontWeight: 700,
                }}>
                  {doneMap[item.id] ? "✓" : ""}
                </span>
                <span style={{
                  fontSize: 15,
                  lineHeight: 1.5,
                  color: doneMap[item.id] ? "#555" : "#e8e8e8",
                  textDecoration: doneMap[item.id] ? "line-through" : "none",
                }}>
                  {item.text}
                </span>
              </button>
            ))}
          </div>
        );
      })}
    </div>
  );
}
