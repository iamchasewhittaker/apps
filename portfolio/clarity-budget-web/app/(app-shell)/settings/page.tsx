import { MigrationBanner } from "@/components/settings/MigrationBanner";
import { YnabConnectorCard } from "@/components/settings/YnabConnectorCard";
import { T } from "@/lib/constants";

export default function SettingsPage() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px", color: T.text }}>
      <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>Settings</h1>
      <p style={{ color: T.muted, marginTop: 4, marginBottom: 24, fontSize: 14 }}>
        Manage your connectors and credentials.
      </p>
      <MigrationBanner />
      <YnabConnectorCard />
    </div>
  );
}
