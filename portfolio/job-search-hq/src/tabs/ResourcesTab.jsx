import React from "react";
import { s, RESOURCES, BACKUP_FOLDER_KEY, backupData, restoreData } from "../constants";
import ErrorBoundary from "../ErrorBoundary";

export default function ResourcesTab() {
  return (
    <ErrorBoundary name="Resources">
      <div style={s.content}>
        {RESOURCES.map(section => (
          <div key={section.category} style={{ marginBottom: 24 }}>
            <div style={{ ...s.sectionLabel, color: section.color, marginBottom: 10 }}>{section.category}</div>
            <div style={s.resourceGrid}>
              {section.items.map(item => (
                <div key={item.title} style={s.resourceCard}>
                  <div style={s.resourceTitle}>{item.title}</div>
                  <div style={s.resourceDesc}>{item.desc}</div>
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noreferrer" style={{ ...s.jobLink, marginTop: 8, display: "inline-block" }}>
                      Open ↗
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={s.weeklyRhythm}>
          <div style={s.sectionLabel}>Your job search ground rules</div>
          {[
            ["Cap active apps", "Never more than 5–7 active rows in Pipeline at once. Quality over volume."],
            ["One task per evening", "Use the Daily Focus tab. Pick one block. Set a timer. Done."],
            ["Sunsama first", "Every evening: open Sunsama, pick tomorrow's job search task, close everything else."],
            ["Follow up at 7 days", "Any application without a response after 7 days gets a follow-up message."],
            ["Lead with Authorize.Net", "Every resume, cover letter, and interview answer should anchor to merchant onboarding at Authorize.Net."],
            ["Never cold outbound AE", "Only target AE roles with inbound or PLG models — Stripe, Plaid, Chargebee. Avoid pure cold quota roles."],
          ].map(([rule, desc]) => (
            <div key={rule} style={s.weekRow}>
              <span style={{ ...s.weekDay, minWidth: 140 }}>{rule}</span>
              <span style={s.weekTask}>{desc}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 8, padding: "16px 18px", background: "#16161c", border: "1px solid #2a2a35", borderRadius: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#e07040", marginBottom: 4 }}>💾 Data Backup</div>
          <div style={{ fontSize: 11, color: "#6b6a72", marginBottom: 12, lineHeight: 1.5 }}>
            Saves your full pipeline, contacts, and profile to a dated JSON file. First tap picks a folder (e.g. "Job Search Backups" in iCloud) — after that it saves there automatically.
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={backupData} style={{
              flex: 1, padding: 11, borderRadius: 8,
              background: "#e07040", color: "#fff", border: "none",
              fontSize: 13, fontWeight: 700, fontFamily: "inherit", cursor: "pointer",
            }}>
              💾 Save Backup →
            </button>
            <button onClick={restoreData} style={{
              flex: 1, padding: 11, borderRadius: 8,
              background: "#1f2937", color: "#d1d5db", border: "1px solid #374151",
              fontSize: 13, fontWeight: 700, fontFamily: "inherit", cursor: "pointer",
            }}>
              📂 Restore from Backup
            </button>
          </div>
          <div style={{ fontSize: 10, color: "#6b6a72", marginTop: 8, textAlign: "center" }}>
            Saved as <em>job-search-backup-YYYY-MM-DD.json</em> · Each backup is a separate dated file.
          </div>
          <div style={{ textAlign: "center", marginTop: 6 }}>
            <button onClick={() => { localStorage.removeItem(BACKUP_FOLDER_KEY); alert("Folder cleared — next backup will ask you to choose a new folder."); }} style={{
              background: "none", border: "none", color: "#6b6a72",
              fontSize: 10, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline",
            }}>
              Change backup folder
            </button>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
