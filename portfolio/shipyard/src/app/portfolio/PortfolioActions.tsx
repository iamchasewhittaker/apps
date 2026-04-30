'use client';

export default function PortfolioActions() {
  return (
    <div className="flex gap-3">
      <button
        onClick={() => alert('Coming in Phase 2')}
        className="rounded-md border border-gold bg-gold/10 px-4 py-2 text-sm font-medium text-gold transition-colors hover:bg-gold/20"
      >
        Export Profile README
      </button>
      <button
        onClick={() => alert('Coming in Phase 2')}
        className="rounded-md border border-dimmer bg-surface/80 px-4 py-2 text-sm font-medium text-steel transition-colors hover:border-gold/40 hover:text-white"
      >
        Suggest Pins
      </button>
    </div>
  );
}
