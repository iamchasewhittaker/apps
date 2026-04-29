import { T } from "@/lib/constants";

export function EmptyState() {
  return (
    <div
      className="rounded-[18px] border p-5"
      style={{ borderColor: T.border, background: T.surface }}
    >
      <p className="font-medium">Connect YNAB to see live safe-to-spend.</p>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: T.muted }}>
        Add a personal access token and pick a budget in{" "}
        <a href="/settings" className="underline" style={{ color: T.accent }}>
          Settings
        </a>
        . Category roles map automatically once a budget loads.
      </p>
    </div>
  );
}
