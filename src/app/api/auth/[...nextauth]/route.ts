import { NextRequest, NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

const authHandler = NextAuth(authOptions);

function withRateLimit(handler: (req: NextRequest, ctx: unknown) => Promise<Response>) {
  return async (req: NextRequest, ctx: unknown) => {
    const ip = (req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("cf-connecting-ip") || "unknown");
    const { success } = rateLimit(ip, { windowMs: 60_000, max: 5 });
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }
    return handler(req, ctx);
  };
}

const GET = withRateLimit(authHandler as unknown as (req: NextRequest, ctx: unknown) => Promise<Response>);
const POST = withRateLimit(authHandler as unknown as (req: NextRequest, ctx: unknown) => Promise<Response>);

export { GET, POST };
