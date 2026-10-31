import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Diagnóstico de prontidão: não altera dados e não expõe URLs nem credenciais.
 * "ready" significa somente que as três tabelas do Observatório respondem.
 */
export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({
      status: "not_ready", database: "not_configured",
      observatoryTables: "not_checked"
    }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
  try {
    const [snapshots, events, changes] = await Promise.all([
      prisma.observatorySnapshot.count(),
      prisma.observatoryEvent.count(),
      prisma.observatoryChange.count()
    ]);
    return NextResponse.json({
      status: "ready", database: "connected",
      observatoryTables: "available",
      counts: { snapshots, events, changes },
      checkedAt: new Date().toISOString(),
      note: "Verifica leitura das tabelas; não valida a rotina agendada."
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[NeuroTwin database readiness] Falha na verificação", error);
    return NextResponse.json({
      status: "not_ready", database: "unverified",
      observatoryTables: "unavailable_or_unverified",
      note: "Verifique conectividade e migração PostgreSQL."
    }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
