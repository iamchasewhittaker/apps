"use client";

interface LogoIconProps {
  size?: number;
  className?: string;
}

export function LogoIcon({ size = 36, className }: LogoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 1024 1024"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="1024" height="1024" rx="200" fill="var(--bg)" />
      <text
        x="512"
        y="780"
        textAnchor="middle"
        fontFamily="var(--font-big-shoulders), 'Big Shoulders Display', system-ui, sans-serif"
        fontSize="620"
        fontWeight="700"
        fill="var(--white)"
        letterSpacing="-20"
      >
        CB
      </text>
      {/* Green bottom-edge accent rule */}
      <rect x="80" y="920" width="864" height="10" rx="5" fill="var(--green)" />
    </svg>
  );
}

interface LogoLockupProps {
  variant?: "stacked" | "horizontal";
  markSize?: number;
  className?: string;
}

export function LogoLockup({ variant = "stacked", markSize = 96, className }: LogoLockupProps) {
  if (variant === "horizontal") {
    return (
      <div className={`flex items-center gap-3 ${className ?? ""}`}>
        <LogoIcon size={markSize} />
        <div className="flex flex-col">
          <span className="font-display text-xl text-white green-rule inline-block">
            CLARITY BUDGET
          </span>
          <span className="font-mono-label text-[9px] text-steel mt-2">MONEY COMMAND</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-4 ${className ?? ""}`}>
      <LogoIcon size={markSize} />
      <div className="flex flex-col items-center gap-2">
        <span className="font-display text-3xl text-white green-rule inline-block">
          CLARITY BUDGET
        </span>
        <span className="font-mono-label text-xs text-steel mt-2">MONEY COMMAND</span>
      </div>
    </div>
  );
}
