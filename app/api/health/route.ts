import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const checks: Record<string, "ok" | "missing" | "error"> = {
    database: "missing",
    cronSecret: process.env.CRON_SECRET ? "ok" : "missing",
  };

  if (process.env.DATABASE_URL) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      checks.database = "ok";
    } catch (error) {
      checks.database = "error";
      console.error("[health] Database connectivity check failed", error instanceof Error ? error.name : "unknown");
    }
  }

  const ready = checks.database === "ok" && checks.cronSecret === "ok";
  return NextResponse.json(
    {
      service: "NeuroTwin 2050",
      status: ready ? "ready" : "degraded",
      checks,
      checkedAt: new Date().toISOString(),
    },
    { status: ready ? 200 : 503, headers: { "Cache-Control": "no-store" } }
  );
}
