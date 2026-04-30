export function EmptyState() {
  return (
    <div className="rounded-2xl border border-dimmer bg-surface/80 backdrop-blur-sm p-5">
      <p className="font-medium">Connect YNAB to see live safe-to-spend.</p>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Add a personal access token and pick a budget in{" "}
        <a href="/settings" className="underline text-accent">
          Settings
        </a>
        . Category roles map automatically once a budget loads.
      </p>
    </div>
  );
}
