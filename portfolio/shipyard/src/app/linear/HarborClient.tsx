'use client';

import { useState } from 'react';
import { createMissingAction, pushStatusesAction, pullUpdatesAction, type ActionResult } from './actions';

type CardState = {
  loading: boolean;
  result: ActionResult | null;
};

function ActionCard({
  title,
  description,
  onRun,
  state,
}: {
  title: string;
  description: string;
  onRun: () => void;
  state: CardState;
}) {
  return (
    <div className="flex flex-col rounded-lg border border-border bg-card p-5 space-y-3">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="flex-1 text-xs text-muted leading-relaxed">{description}</p>
      {state.result && (
        <p className={`text-xs font-medium ${state.result.ok ? 'text-green-400' : 'text-red-400'}`}>
          {state.result.message}
        </p>
      )}
      <button
        onClick={onRun}
        disabled={state.loading}
        className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:border-accent/50 hover:text-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {state.loading ? (
          <>
            <span className="h-3.5 w-3.5 rounded-full border-2 border-accent border-t-transparent animate-spin" />
            Running…
          </>
        ) : (
          'Run'
        )}
      </button>
    </div>
  );
}

export default function HarborClient() {
  const [createState, setCreateState] = useState<CardState>({ loading: false, result: null });
  const [pushState, setPushState] = useState<CardState>({ loading: false, result: null });
  const [pullState, setPullState] = useState<CardState>({ loading: false, result: null });

  async function handleCreate() {
    setCreateState({ loading: true, result: null });
    const result = await createMissingAction();
    setCreateState({ loading: false, result });
    if (result.ok) window.location.reload();
  }

  async function handlePush() {
    setPushState({ loading: true, result: null });
    const result = await pushStatusesAction();
    setPushState({ loading: false, result });
  }

  async function handlePull() {
    setPullState({ loading: true, result: null });
    const result = await pullUpdatesAction();
    setPullState({ loading: false, result });
    if (result.ok) window.location.reload();
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <ActionCard
        title="Create Missing in Linear"
        description="Scan fleet and create Linear projects for any unlinked ships."
        onRun={handleCreate}
        state={createState}
      />
      <ActionCard
        title="Push Statuses"
        description="Update Linear project statuses to match current fleet state."
        onRun={handlePush}
        state={pushState}
      />
      <ActionCard
        title="Pull Updates"
        description="Fetch latest Linear issue counts and sync back to Shipyard."
        onRun={handlePull}
        state={pullState}
      />
    </div>
  );
}
