import type { NextRequest } from "next/server";

const VERIFY_ENDPOINT =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    // Check if request is from localhost (development)
    const origin = request.headers.get("origin") || "";
    const isLocalhost =
      origin.includes("localhost") || origin.includes("127.0.0.1");

    // Skip verification on localhost
    if (isLocalhost) {
      return Response.json(
        {
          success: true,
          data: {
            success: true,
            challenge_ts: new Date().toISOString(),
            hostname: "localhost",
            notes: "Development environment - captcha verification skipped",
          },
        },
        { status: 200 },
      );
    }

    if (!token) {
      return Response.json(
        { success: false, error: "Token is required" },
        { status: 400 },
      );
    }

    const secret = process.env.NEXT_PUBLIC_CLOUDFLARE_SECRET_KEY;

    if (!secret) {
      console.error("NEXT_PUBLIC_CLOUDFLARE_SECRET_KEY is not set");
      return Response.json(
        { success: false, error: "Server configuration error" },
        { status: 500 },
      );
    }

    const response = await fetch(VERIFY_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
    });

    const data = await response.json();

    if (data.success) {
      return Response.json({ success: true, data }, { status: 200 });
    } else {
      return Response.json(
        {
          success: false,
          error: data.error_codes?.join(", ") || "Verification failed",
        },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
