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
      <rect width="1024" height="1024" rx="220" fill="var(--gold)" />
      <g fill="var(--bg)">
        <rect x="440" y="90" width="40" height="590" rx="10" />
        <polygon points="480,110 480,670 870,670" />
        <polygon points="440,140 440,610 170,610" />
        <path d="M140 690 Q165 670 250 670 L774 670 Q860 670 884 690 L810 850 Q740 900 512 900 Q284 900 214 850 Z" />
        <path d="M420 900 L465 950 L559 950 L604 900" />
        <path d="M160 730 Q280 706 400 730 Q520 754 640 730 Q760 706 870 730 L870 754 Q760 730 640 754 Q520 778 400 754 Q280 730 160 754 Z" fill="var(--gold)" />
      </g>
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
