import SettingsClient from "./SettingsClient";

export default function SettingsPage() {
  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, marginTop: 0 }}>
        ⚙️ Settings
      </h1>
      <p style={{ color: "#777", fontSize: 14, marginTop: 0, marginBottom: 24 }}>
        Export progress, import on a new device, configure copy behavior
      </p>
      <SettingsClient />
    </div>
  );
}
