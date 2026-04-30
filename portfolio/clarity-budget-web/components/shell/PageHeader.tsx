interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="font-display text-3xl text-white green-rule inline-block">{title}</h1>
      {subtitle && (
        <p className="font-mono-label text-xs text-steel mt-4">{subtitle}</p>
      )}
    </div>
  );
}
