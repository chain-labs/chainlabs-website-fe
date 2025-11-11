import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Check if request is from localhost (development)
    const origin = request.headers.get("origin") || "";
    const isLocalhost =
      origin.includes("localhost") || origin.includes("127.0.0.1");

    // For development and since we removed Cloudflare, always return success
    return Response.json(
      {
        success: true,
        data: {
          success: true,
          challenge_ts: new Date().toISOString(),
          hostname: isLocalhost ? "localhost" : request.headers.get("host") || "",
          notes: "Verification bypassed - Cloudflare Turnstile removed",
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Verification error:", error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
