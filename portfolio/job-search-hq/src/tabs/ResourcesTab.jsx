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

        <div style={{ marginBottom: 24, padding: "14px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(59,130,246,0.12)", borderRadius: 12 }}>
          <div style={{ ...s.sectionLabel, color: "#60a5fa", marginBottom: 8 }}>Chrome extension (MVP)</div>
          <div style={{ fontSize: 14, color: "#FFFFFF", lineHeight: 1.55, marginBottom: 10 }}>
            Load the unpacked extension from the repo folder <code style={{ fontSize: 14, color: "#93c5fd" }}>extension/</code> — capture LinkedIn profiles and job postings into this app, and show an Action Queue badge while Job Search HQ is open. Full steps: see <code style={{ fontSize: 14, color: "#93c5fd" }}>extension/README.md</code> in the project (clone / monorepo).
          </div>
        </div>

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

        <div style={{ marginTop: 8, padding: "16px 18px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(59,130,246,0.12)", borderRadius: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#e07040", marginBottom: 4 }}>💾 Data Backup</div>
          <div style={{ fontSize: 14, color: "#A0AABF", marginBottom: 12, lineHeight: 1.5 }}>
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
              background: "rgba(59,130,246,0.12)", color: "#FFFFFF", border: "1px solid rgba(59,130,246,0.2)",
              fontSize: 14, fontWeight: 700, fontFamily: "inherit", cursor: "pointer",
            }}>
              📂 Restore from Backup
            </button>
          </div>
          <div style={{ fontSize: 12, color: "#A0AABF", marginTop: 8, textAlign: "center" }}>
            Saved as <em>job-search-backup-YYYY-MM-DD.json</em> · Each backup is a separate dated file.
          </div>
          <div style={{ textAlign: "center", marginTop: 6 }}>
            <button onClick={() => { localStorage.removeItem(BACKUP_FOLDER_KEY); alert("Folder cleared — next backup will ask you to choose a new folder."); }} style={{
              background: "none", border: "none", color: "#A0AABF",
              fontSize: 12, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline",
            }}>
              Change backup folder
            </button>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
