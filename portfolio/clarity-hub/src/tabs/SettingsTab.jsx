import { T } from "../theme";
export default function SettingsTab({ signOut }) {
  return (
    <div style={{ padding: 16, color: T.text }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Settings</h2>
      <button onClick={signOut} style={{
        padding: "10px 20px", borderRadius: 8, background: T.red, border: "none",
        color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer",
      }}>Sign Out</button>
    </div>
  );
}
