import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0B0B0F 0%, #111827 50%, #0B0B0F 100%)",
          color: "white",
          fontSize: 96,
          fontWeight: 700,
          letterSpacing: -2,
        }}
      >
        Chain Labs
      </div>
    ),
    {
      ...size,
    },
  );
}
