import { T } from "@/lib/constants";
import { createRouteClient } from "@/lib/supabase-server";
import { ProposalList } from "@/components/review/ProposalList";
import type { Proposal } from "@/components/review/ProposalRow";

export default async function ReviewPage() {
  const supabase = await createRouteClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let proposals: Proposal[] = [];
  if (user) {
    const { data } = await supabase
      .from("clarity_budget_proposals")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    proposals = (data ?? []) as Proposal[];
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px", color: T.text }}>
      <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>Review Proposals</h1>
      <p style={{ color: T.muted, marginTop: 4, marginBottom: 24, fontSize: 14 }}>
        Approve or dismiss payee rename suggestions generated from your Privacy.com transactions.
      </p>
      <ProposalList initialProposals={proposals} />
    </div>
  );
}
