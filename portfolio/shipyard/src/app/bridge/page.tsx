import { ModeHeading } from '@/components/ModeHeading';
import {
  CATEGORY_ORDER,
  type DailySite,
  sitesByCategory,
} from '@/lib/daily-sites';

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export default function BridgePage() {
  const grouped = sitesByCategory();

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <ModeHeading
        labelKey="bridge"
        subtitle="Sites you steer the day with — one tab away from each."
      />

      <div className="space-y-10">
        {CATEGORY_ORDER.map(({ key, label }) => {
          const sites = grouped[key];
          if (!sites || sites.length === 0) return null;

          return (
            <section key={key} className="space-y-4">
              <h2 className="font-mono-label text-xs text-dim flex items-center gap-3">
                <span>{label}</span>
                <span className="h-px flex-1 bg-dimmer/60" aria-hidden />
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {sites.map((site) => (
                  <SiteCard key={site.url} site={site} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function SiteCard({ site }: { site: DailySite }) {
  const hostname = hostnameOf(site.url);
  const favicon = `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;

  return (
    <a
      href={site.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-gold"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-ghost">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={favicon} alt="" width={20} height={20} className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-foreground group-hover:text-gold">
          {site.name}
        </span>
        {site.note && (
          <span className="block truncate text-xs text-dim">{site.note}</span>
        )}
      </span>
    </a>
  );
}
