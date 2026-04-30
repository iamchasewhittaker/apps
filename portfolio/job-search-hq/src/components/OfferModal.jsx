import React, { useState } from "react";
import {
  s,
  blankOfferDetails, normalizeOfferDetails, computeOfferTotal, formatCurrency,
} from "../constants";

const BONUS_TYPES = [
  { value: "target",        label: "Target" },
  { value: "guaranteed",    label: "Guaranteed" },
  { value: "discretionary", label: "Discretionary" },
];

function Currency({ value, onChange, placeholder }) {
  return (
    <div style={{ position: "relative" }}>
      <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#A0AABF", fontSize: 13 }}>$</span>
      <input
        style={{ ...s.input, paddingLeft: 22 }}
        type="text"
        inputMode="decimal"
        value={value || ""}
        onChange={e => onChange(e.target.value.replace(/[^\d.]/g, ""))}
        placeholder={placeholder}
      />
    </div>
  );
}

export default function OfferModal({ app, onSave, onClose }) {
  const [draft, setDraft] = useState(normalizeOfferDetails(app.offerDetails || blankOfferDetails()));

  function set(field, value) {
    setDraft(prev => ({ ...prev, [field]: value }));
  }

  function save() {
    onSave({ ...app, offerDetails: normalizeOfferDetails(draft) });
    onClose();
  }

  const previewTotal = computeOfferTotal(draft);

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={{ ...s.modal, maxWidth: 680 }} onClick={e => e.stopPropagation()}>
        <div style={s.modalHeader}>
          <div>
            <span>💰 Offer details</span>
            <div style={{ fontSize: 14, color: "#A0AABF", fontWeight: 400, marginTop: 2 }}>
              {app.company} — {app.title}
            </div>
          </div>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div style={s.modalBody}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            <div>
              <div style={{ ...s.fieldLabel, color: "#22c55e", textTransform: "uppercase", letterSpacing: 0.8 }}>Compensation</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginTop: 6 }}>
                <div>
                  <div style={s.fieldLabel}>Base salary (annual)</div>
                  <Currency value={draft.baseSalary} onChange={v => set("baseSalary", v)} placeholder="e.g. 120000" />
                </div>
                <div>
                  <div style={s.fieldLabel}>Bonus target (annual)</div>
                  <Currency value={draft.bonusTarget} onChange={v => set("bonusTarget", v)} placeholder="e.g. 15000" />
                </div>
                <div>
                  <div style={s.fieldLabel}>Bonus type</div>
                  <select style={s.input} value={draft.bonusType} onChange={e => set("bonusType", e.target.value)}>
                    {BONUS_TYPES.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                  </select>
                </div>
                <div>
                  <div style={s.fieldLabel}>Sign-on bonus</div>
                  <Currency value={draft.signOnBonus} onChange={v => set("signOnBonus", v)} placeholder="e.g. 10000" />
                </div>
                <div>
                  <div style={s.fieldLabel}>Equity (annualized)</div>
                  <Currency value={draft.equity} onChange={v => set("equity", v)} placeholder="vest value / yr" />
                </div>
              </div>
              <div style={{ marginTop: 8 }}>
                <div style={s.fieldLabel}>Equity notes (grant size, vesting schedule, etc.)</div>
                <textarea style={{ ...s.textarea, minHeight: 48 }} value={draft.equityNotes} onChange={e => set("equityNotes", e.target.value)} placeholder="e.g. 4-year vest, 1-year cliff, $200k total grant" />
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.03)", border: "1.5px solid rgba(59,130,246,0.12)", borderRadius: 10, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 14, color: "#A0AABF", textTransform: "uppercase", letterSpacing: 0.8 }}>Total comp estimate</div>
                <div style={{ fontSize: 14, color: "#A0AABF", marginTop: 2 }}>base + bonus + equity/yr + sign-on/4</div>
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: previewTotal != null ? "#22c55e" : "#A0AABF" }}>
                {formatCurrency(previewTotal)}
              </div>
            </div>

            <div>
              <div style={{ ...s.fieldLabel, color: "#22c55e", textTransform: "uppercase", letterSpacing: 0.8 }}>Offer terms</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginTop: 6 }}>
                <div>
                  <div style={s.fieldLabel}>Offer received</div>
                  <input style={s.input} type="date" value={draft.receivedDate} onChange={e => set("receivedDate", e.target.value)} />
                </div>
                <div>
                  <div style={s.fieldLabel}>Decide by</div>
                  <input style={s.input} type="date" value={draft.decisionBy} onChange={e => set("decisionBy", e.target.value)} />
                </div>
                <div>
                  <div style={s.fieldLabel}>Start date</div>
                  <input style={s.input} type="date" value={draft.startDate} onChange={e => set("startDate", e.target.value)} />
                </div>
                <div>
                  <div style={s.fieldLabel}>PTO (weeks)</div>
                  <input style={s.input} type="text" inputMode="decimal" value={draft.ptoWeeks} onChange={e => set("ptoWeeks", e.target.value.replace(/[^\d.]/g, ""))} placeholder="e.g. 4" />
                </div>
                <div>
                  <div style={s.fieldLabel}>Location</div>
                  <input style={s.input} value={draft.location} onChange={e => set("location", e.target.value)} placeholder="Remote / Austin / Hybrid" />
                </div>
                <div>
                  <div style={s.fieldLabel}>Remote / flex</div>
                  <input style={s.input} value={draft.remoteFlex} onChange={e => set("remoteFlex", e.target.value)} placeholder="Remote OK · 2 days in-office" />
                </div>
              </div>
              <div style={{ marginTop: 8 }}>
                <div style={s.fieldLabel}>Benefits notes (health, 401k, learning budget, etc.)</div>
                <textarea style={{ ...s.textarea, minHeight: 48 }} value={draft.benefitsNotes} onChange={e => set("benefitsNotes", e.target.value)} placeholder="100% premium covered · 6% 401k match · $2k learning" />
              </div>
            </div>

            <div>
              <div style={s.fieldLabel}>Notes</div>
              <textarea style={{ ...s.textarea, minHeight: 56 }} value={draft.notes} onChange={e => set("notes", e.target.value)} placeholder="Anything else — negotiation points, red flags, context…" />
            </div>

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button style={s.btnSecondary} onClick={onClose}>Cancel</button>
              <button style={s.btnPrimary} onClick={save}>Save offer</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
