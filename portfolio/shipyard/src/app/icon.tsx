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
          background: "#07101E",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg viewBox="0 0 1024 1024" width={28} height={28}>
          <g
            fill="none"
            stroke="#F2EEE6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="512" cy="512" r="288" strokeWidth="70" />
            <g strokeWidth="62">
              <line x1="512" y1="220" x2="512" y2="804" />
              <line x1="220" y1="512" x2="804" y2="512" />
              <line x1="305" y1="305" x2="719" y2="719" />
              <line x1="305" y1="719" x2="719" y2="305" />
            </g>
          </g>
          <circle cx="512" cy="512" r="60" fill="#F2EEE6" />
          <circle cx="512" cy="296" r="40" fill="#4A90DE" />
          <circle cx="512" cy="728" r="40" fill="#4A90DE" />
          <circle cx="296" cy="512" r="40" fill="#4A90DE" />
          <circle cx="728" cy="512" r="40" fill="#4A90DE" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
