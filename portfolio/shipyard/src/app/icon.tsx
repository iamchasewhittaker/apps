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
          background: "#1e3a5f",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ color: "#e2e8f0", fontWeight: 900, fontSize: 13, lineHeight: 1, letterSpacing: "-0.5px" }}>
          SY
        </span>
        <span style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 5, lineHeight: 1, letterSpacing: "1.5px", opacity: 0.75, marginTop: 2 }}>
          SHIPYARD
        </span>
      </div>
    ),
    { ...size }
  );
}
