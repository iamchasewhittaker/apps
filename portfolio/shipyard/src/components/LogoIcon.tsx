type LogoIconProps = {
  size?: number;
  className?: string;
};

export function LogoIcon({ size = 36, className = "" }: LogoIconProps) {
  return (
    <svg
      viewBox="0 0 1024 1024"
      width={size}
      height={size}
      className={`flex-shrink-0 ${className}`}
      role="img"
      aria-label="Shipyard"
    >
      <rect width="1024" height="1024" rx="220" fill="var(--bg)" />
      <g fill="none" stroke="var(--white)" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="512" cy="512" r="288" strokeWidth="34" />
        <g strokeWidth="30">
          <line x1="512" y1="220" x2="512" y2="804" />
          <line x1="220" y1="512" x2="804" y2="512" />
          <line x1="305" y1="305" x2="719" y2="719" />
          <line x1="305" y1="719" x2="719" y2="305" />
        </g>
        <g strokeWidth="30">
          <line x1="512" y1="170" x2="512" y2="252" />
          <line x1="512" y1="772" x2="512" y2="854" />
          <line x1="170" y1="512" x2="252" y2="512" />
          <line x1="772" y1="512" x2="854" y2="512" />
        </g>
      </g>
      <circle cx="512" cy="512" r="58" fill="none" stroke="var(--white)" strokeWidth="22" />
      <circle cx="512" cy="512" r="10" fill="var(--white)" />
      <circle cx="512" cy="296" r="22" fill="var(--steel)" />
      <circle cx="512" cy="728" r="22" fill="var(--steel)" />
      <circle cx="296" cy="512" r="22" fill="var(--steel)" />
      <circle cx="728" cy="512" r="22" fill="var(--steel)" />
    </svg>
  );
}

type LogoLockupProps = {
  variant?: "stacked" | "horizontal";
  markSize?: number;
  className?: string;
};

export function LogoLockup({
  variant = "stacked",
  markSize = 96,
  className = "",
}: LogoLockupProps) {
  if (variant === "horizontal") {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <LogoIcon size={markSize} />
        <div className="flex flex-col leading-none">
          <span className="font-display text-3xl text-white gold-rule">
            SHIPYARD
          </span>
          <span className="font-mono-label text-xs text-dim mt-3">
            FLEET COMMAND
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <LogoIcon size={markSize} />
      <div className="flex flex-col items-center leading-none">
        <span className="font-display text-3xl text-white gold-rule">
          SHIPYARD
        </span>
        <span className="font-mono-label text-xs text-dim mt-3">
          FLEET COMMAND
        </span>
      </div>
    </div>
  );
}
