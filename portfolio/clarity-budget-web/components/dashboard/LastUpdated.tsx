interface LastUpdatedProps {
  updated: Date | null;
  loading: boolean;
  onRefresh: () => void;
}

export function LastUpdated({ updated, loading, onRefresh }: LastUpdatedProps) {
  return (
    <div className="flex items-center justify-between">
      {updated && (
        <p className="text-xs text-muted">
          Updated {updated.toLocaleString()}
        </p>
      )}
      <button
        type="button"
        className="ml-auto rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white"
        disabled={loading}
        onClick={onRefresh}
      >
        {loading ? "Refreshing…" : "Refresh numbers"}
      </button>
    </div>
  );
}
