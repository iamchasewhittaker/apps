import { CardMappingTable } from "@/components/settings/CardMappingTable";
import { PrivacyConnectorCard } from "@/components/settings/PrivacyConnectorCard";
import { YnabConnectorCard } from "@/components/settings/YnabConnectorCard";
import { PageHeader } from "@/components/shell/PageHeader";
import { createRouteClient } from "@/lib/supabase-server";

export default async function SettingsPage() {
  const supabase = await createRouteClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let hasEncryptedYnabToken = false;
  let hasEncryptedPrivacyToken = false;
  let defaultBudgetId: string | null = null;
  if (user) {
    const { data: cred } = await supabase
      .from("clarity_budget_credentials")
      .select("ynab_token_ciphertext, privacy_token_ciphertext, default_budget_id")
      .eq("user_id", user.id)
      .maybeSingle();
    hasEncryptedYnabToken = !!cred?.ynab_token_ciphertext;
    hasEncryptedPrivacyToken = !!cred?.privacy_token_ciphertext;
    defaultBudgetId = cred?.default_budget_id ?? null;
  }

  return (
    <div className="max-w-[720px] mx-auto">
      <PageHeader title="Settings" subtitle="CONNECTORS & CREDENTIALS" />
      <YnabConnectorCard
        hasEncryptedYnabToken={hasEncryptedYnabToken}
        defaultBudgetId={defaultBudgetId}
      />
      <PrivacyConnectorCard hasEncryptedPrivacyToken={hasEncryptedPrivacyToken} />
      {hasEncryptedPrivacyToken && <CardMappingTable />}
    </div>
  );
}
