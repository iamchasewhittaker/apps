import { T } from "@/lib/constants";
import { createRouteClient } from "@/lib/supabase-server";
import { FlagList } from "@/components/flags/FlagList";
import type { Flag } from "@/components/flags/FlagRow";

export default async function FlagsPage() {
  const supabase = await createRouteClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let flags: Flag[] = [];
  if (user) {
    const { data } = await supabase
      .from("clarity_budget_flags")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "open")
      .order("created_at", { ascending: false });
    flags = (data ?? []) as Flag[];
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px", color: T.text }}>
      <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>Flags</h1>
      <p style={{ color: T.muted, marginTop: 4, marginBottom: 24, fontSize: 14 }}>
        Anomalies your reconcile job found in the last sync.
      </p>
      <FlagList initialFlags={flags} />
    </div>
  );
}
