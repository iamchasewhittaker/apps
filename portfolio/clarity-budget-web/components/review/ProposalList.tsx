"use client";

import { useState } from "react";
import { ProposalRow, type Proposal } from "./ProposalRow";

type Props = {
  initialProposals: Proposal[];
};

export function ProposalList({ initialProposals }: Props) {
  const [proposals, setProposals] = useState<Proposal[]>(initialProposals);

  function onResolved(id: string) {
    setProposals((prev) => prev.filter((p) => p.id !== id));
  }

  if (proposals.length === 0) {
    return (
      <p className="text-sm text-muted">
        No pending proposals. Run categorization to generate new ones.
      </p>
    );
  }

  return (
    <div>
      {proposals.map((p) => (
        <ProposalRow key={p.id} proposal={p} onResolved={onResolved} />
      ))}
    </div>
  );
}
