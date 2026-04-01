import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function GET() {
  const headerStore = await headers();
  const authorization = headerStore.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authorization !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();

    const result = await prisma.post.updateMany({
      where: {
        published: false,
        scheduledAt: { lte: now },
      },
      data: {
        published: true,
      },
    });

    return NextResponse.json({
      published: result.count,
      checkedAt: now.toISOString(),
    });
  } catch (error) {
    console.error("Cron publish error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
