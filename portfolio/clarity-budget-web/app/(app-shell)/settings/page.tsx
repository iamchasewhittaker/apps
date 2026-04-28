import { MigrationBanner } from "@/components/settings/MigrationBanner";
import { YnabConnectorCard } from "@/components/settings/YnabConnectorCard";
import { T } from "@/lib/constants";
import { createRouteClient } from "@/lib/supabase-server";

export default async function SettingsPage() {
  const supabase = await createRouteClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let hasEncryptedYnabToken = false;
  if (user) {
    const { data: cred } = await supabase
      .from("clarity_budget_credentials")
      .select("ynab_token_ciphertext")
      .eq("user_id", user.id)
      .maybeSingle();
    hasEncryptedYnabToken = !!cred?.ynab_token_ciphertext;
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px", color: T.text }}>
      <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>Settings</h1>
      <p style={{ color: T.muted, marginTop: 4, marginBottom: 24, fontSize: 14 }}>
        Manage your connectors and credentials.
      </p>
      <MigrationBanner hasEncryptedYnabToken={hasEncryptedYnabToken} />
      <YnabConnectorCard hasEncryptedYnabToken={hasEncryptedYnabToken} />
    </div>
  );
}
