import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 7,
          background: "#FFD700",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg viewBox="0 0 1024 1024" width={28} height={28}>
          <g fill="#0A1128">
            <rect x="440" y="90" width="40" height="590" rx="10" />
            <polygon points="480,110 480,670 870,670" />
            <polygon points="440,140 440,610 170,610" />
            <path d="M140 690 Q165 670 250 670 L774 670 Q860 670 884 690 L810 850 Q740 900 512 900 Q284 900 214 850 Z" />
            <path d="M420 900 L465 950 L559 950 L604 900" />
          </g>
        </svg>
      </div>
    ),
    { ...size }
  );
}
