import { createRouteClient } from "@/lib/supabase-server";
import { ProposalList } from "@/components/review/ProposalList";
import { PageHeader } from "@/components/shell/PageHeader";
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
    <div className="max-w-[720px] mx-auto">
      <PageHeader title="Review" subtitle="PAYEE RENAME PROPOSALS" />
      <ProposalList initialProposals={proposals} />
    </div>
  );
}
