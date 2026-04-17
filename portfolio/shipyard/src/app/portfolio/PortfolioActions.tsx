'use client';

export default function PortfolioActions() {
  return (
    <div className="flex gap-3">
      <button
        onClick={() => alert('Coming in Phase 2')}
        className="rounded-md border border-accent bg-accent/10 px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/20"
      >
        Export Profile README
      </button>
      <button
        onClick={() => alert('Coming in Phase 2')}
        className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-accent/40 hover:text-foreground"
      >
        Suggest Pins
      </button>
    </div>
  );
}
