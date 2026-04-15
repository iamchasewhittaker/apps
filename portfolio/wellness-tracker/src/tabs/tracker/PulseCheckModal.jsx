import React from "react";
import { T } from "../../theme";

export function PulseCheckModal({ onClose, onSave }) {
  const NUM_SCALE = [1,2,3,4,5,6,7,8,9,10];
  const [focus, setFocus] = React.useState(null);
  const [mood, setMood] = React.useState(null);
  const [anxiety, setAnxiety] = React.useState(null);
  const [sideEffects, setSideEffects] = React.useState("no");
  const [sideEffectDetail, setSideEffectDetail] = React.useState("");
  const [medsHelpful, setMedsHelpful] = React.useState(null);

  const NumRow = ({ value, onChange, color }) => (
    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
      {NUM_SCALE.map(n => (
        <button key={n} onClick={() => onChange(n)} style={{
          width: 40, height: 40, borderRadius: 7, fontSize: 14, fontWeight: 700,
          cursor: "pointer", fontFamily: "inherit",
          border: "2px solid " + (value === n ? color : T.border),
          background: value === n ? color + "22" : T.surface,
          color: value === n ? color : T.muted,
        }}>{n}</button>
      ))}
    </div>
  );

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

  const handleSave = () => {
    onSave({
      time: now.toISOString(),
      timeLabel: timeStr,
      focus,
      mood,
      anxiety,
      sideEffects,
      sideEffectDetail: sideEffects === "yes" ? sideEffectDetail : "",
      medsHelpful,
    });
    onClose();
  };

  const canSave = focus !== null || mood !== null || anxiety !== null || medsHelpful !== null;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ background: T.surface, borderRadius: "16px 16px 0 0", width: "100%", maxWidth: 500, maxHeight: "88vh", overflowY: "auto", padding: "20px 20px 36px" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: T.text }}>Pulse Check</div>
            <div style={{ fontSize: 11, color: T.muted }}>{timeStr} - about 30 seconds</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, color: T.muted, cursor: "pointer" }}>x</button>
        </div>

        <div style={{ height: 1, background: T.border, margin: "12px 0" }} />

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}><span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: "50%", background: T.faint, border: "1.5px solid " + T.border, fontSize: 10, fontWeight: 700, color: T.muted, display: "flex", alignItems: "center", justifyContent: "center" }}>1</span><div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Focus and concentration</div></div>
          <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>1 = cannot focus, 10 = locked in</div>
          <NumRow value={focus} onChange={setFocus} color={T.warn} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}><span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: "50%", background: T.faint, border: "1.5px solid " + T.border, fontSize: 10, fontWeight: 700, color: T.muted, display: "flex", alignItems: "center", justifyContent: "center" }}>2</span><div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Mood (anxiety or depression)</div></div>
          <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>1 = very low, 10 = great</div>
          <NumRow value={mood} onChange={setMood} color={T.blue} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}><span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: "50%", background: T.faint, border: "1.5px solid " + T.border, fontSize: 10, fontWeight: 700, color: T.muted, display: "flex", alignItems: "center", justifyContent: "center" }}>3</span><div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Anxiety</div></div>
          <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>1 = none, 10 = overwhelming</div>
          <NumRow value={anxiety} onChange={setAnxiety} color={"#7B5EA7"} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}><span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: "50%", background: T.faint, border: "1.5px solid " + T.border, fontSize: 10, fontWeight: 700, color: T.muted, display: "flex", alignItems: "center", justifyContent: "center" }}>4</span><div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Side effects right now?</div></div>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            {[{ v: "no", l: "None" }, { v: "yes", l: "Yes" }].map(o => (
              <button key={o.v} onClick={() => setSideEffects(o.v)} style={{
                flex: 1, padding: "10px 0", borderRadius: 8, fontSize: 13, fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit",
                border: "2px solid " + (sideEffects === o.v ? T.accent : T.border),
                background: sideEffects === o.v ? T.accentLight : T.surface,
                color: sideEffects === o.v ? T.accent : T.muted,
              }}>{o.l}</button>
            ))}
          </div>
          {sideEffects === "yes" && (
            <input value={sideEffectDetail} onChange={e => setSideEffectDetail(e.target.value)}
              placeholder="e.g. headache, jittery, appetite gone, too wired..."
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid " + T.border, background: T.surface, color: T.text, fontSize: 16, fontFamily: "inherit", boxSizing: "border-box" }} />
          )}
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}><span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: "50%", background: T.faint, border: "1.5px solid " + T.border, fontSize: 10, fontWeight: 700, color: T.muted, display: "flex", alignItems: "center", justifyContent: "center" }}>5</span><div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Did meds feel helpful today?</div></div>
          <div style={{ display: "flex", gap: 8 }}>
            {[{ v: "helpful", l: "Helpful" }, { v: "not_enough", l: "Not enough" }, { v: "too_much", l: "Too much" }].map(o => (
              <button key={o.v} onClick={() => setMedsHelpful(o.v)} style={{
                flex: 1, padding: "10px 0", borderRadius: 8, fontSize: 12, fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit",
                border: "2px solid " + (medsHelpful === o.v ? T.warn : T.border),
                background: medsHelpful === o.v ? T.warn + "22" : T.surface,
                color: medsHelpful === o.v ? T.warn : T.muted,
              }}>{o.l}</button>
            ))}
          </div>
        </div>

        <button onClick={handleSave} disabled={!canSave} style={{
          width: "100%", padding: "14px 0", borderRadius: 10, fontSize: 15, fontWeight: 700,
          cursor: canSave ? "pointer" : "default", fontFamily: "inherit", border: "none",
          background: canSave ? T.accent : T.border,
          color: canSave ? "#fff" : T.muted,
        }}>Save Pulse Check</button>
        {!canSave && (
          <div style={{ textAlign: "center", fontSize: 11, color: T.muted, marginTop: 8 }}>Answer at least one question to save</div>
        )}
      </div>
    </div>
  );
}
