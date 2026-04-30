import React from "react";
import { T } from "../tokens";
import { s, RESOURCES, BACKUP_FOLDER_KEY, backupData, restoreData } from "../constants";
import ErrorBoundary from "../ErrorBoundary";

export default function ResourcesTab() {
  return (
    <ErrorBoundary name="Resources">
      <div style={s.content}>
        {/* Ground rules first -- behavioral anchoring */}
        <div style={s.weeklyRhythm}>
          <div style={s.sectionLabel}>Your job search ground rules</div>
          {[
            ["Cap active apps", "Never more than 5-7 active rows in Pipeline at once. Quality over volume."],
            ["One task per evening", "Use the Daily Focus tab. Pick one block. Set a timer. Done."],
            ["Sunsama first", "Every evening: open Sunsama, pick tomorrow's job search task, close everything else."],
            ["Follow up at 7 days", "Any application without a response after 7 days gets a follow-up message."],
            ["Lead with Authorize.Net", "Every resume, cover letter, and interview answer should anchor to merchant onboarding at Authorize.Net."],
            ["Never cold outbound AE", "Only target AE roles with inbound or PLG models. Avoid pure cold quota roles."],
          ].map(([rule, desc]) => (
            <div key={rule} style={s.weekRow}>
              <span style={{ ...s.weekDay, minWidth: 140 }}>{rule}</span>
              <span style={s.weekTask}>{desc}</span>
            </div>
          ))}
        </div>

        {/* Resource grid */}
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
                      Open
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Chrome extension -- compact, one-time reference */}
        <div style={{ ...s.cardCompact, marginBottom: 16 }}>
          <div style={{ ...s.sectionLabel, color: T.highlight, marginBottom: 6 }}>Chrome extension (MVP)</div>
          <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.55 }}>
            Load the unpacked extension from <code style={{ fontSize: 13, color: T.highlightLight }}>extension/</code> to capture LinkedIn profiles and job postings. Full steps in <code style={{ fontSize: 13, color: T.highlightLight }}>extension/README.md</code>.
          </div>
        </div>

        {/* Data backup -- compact, bottom */}
        <div style={s.cardCompact}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.backupOrange, marginBottom: 4 }}>Data Backup</div>
          <div style={{ fontSize: 13, color: T.muted, marginBottom: 10, lineHeight: 1.5 }}>
            Saves pipeline, contacts, and profile to a dated JSON file.
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={backupData} style={{
              flex: 1, padding: 11, borderRadius: 8,
              background: T.backupOrange, color: T.foreground, border: "none",
              fontSize: 13, fontWeight: 700, fontFamily: "inherit", cursor: "pointer", minHeight: 44,
            }}>
              Save Backup
            </button>
            <button onClick={restoreData} style={{
              flex: 1, padding: 11, borderRadius: 8,
              background: T.border, color: T.foreground, border: `1px solid ${T.borderInput}`,
              fontSize: 13, fontWeight: 700, fontFamily: "inherit", cursor: "pointer", minHeight: 44,
            }}>
              Restore from Backup
            </button>
          </div>
          <div style={{ fontSize: 11, color: T.muted, marginTop: 6, textAlign: "center" }}>
            <button onClick={() => { localStorage.removeItem(BACKUP_FOLDER_KEY); alert("Folder cleared — next backup will ask you to choose a new folder."); }} style={{
              background: "none", border: "none", color: T.muted,
              fontSize: 11, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline",
            }}>
              Change backup folder
            </button>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
