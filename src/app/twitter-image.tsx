import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function TwitterImage() {
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
            "radial-gradient(1000px 600px at 50% 50%, #1f2937 0%, #0B0B0F 60%, #0B0B0F 100%)",
          color: "white",
          fontSize: 84,
          fontWeight: 700,
          letterSpacing: -1,
        }}
      >
        Chain Labs
      </div>
    ),
    {
      ...size,
    }
  );
}

