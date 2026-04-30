import { createRouteClient } from "@/lib/supabase-server";
import { FlagList } from "@/components/flags/FlagList";
import { PageHeader } from "@/components/shell/PageHeader";
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
    <div className="max-w-[720px] mx-auto">
      <PageHeader title="Flags" subtitle="RECONCILE ANOMALIES" />
      <FlagList initialFlags={flags} />
    </div>
  );
}
