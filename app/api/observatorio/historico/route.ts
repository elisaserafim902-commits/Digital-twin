import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Histórico público do Observatório. Somente dados agregados e eventos
 * provenientes das fontes públicas; nunca expõe credenciais ou usuários.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const requested = Number(url.searchParams.get("limit") || 25);
  const limit = Number.isFinite(requested) ? Math.min(100, Math.max(1, Math.floor(requested))) : 25;
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({
      status: "indisponivel", motivo: "historico_nao_configurado",
      historicoDisponivel: false, eventos: []
    }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
  try {
    const [snapshots, changes] = await Promise.all([
      prisma.observatorySnapshot.findMany({
        orderBy: { createdAt: "desc" }, take: Math.min(limit, 30),
        select: { id: true, createdAt: true, status: true, totalEvents: true }
      }),
      prisma.observatoryChange.findMany({
        orderBy: { createdAt: "desc" }, take: limit,
        select: { id: true, createdAt: true, eventId: true, changeType: true }
      })
    ]);
    return NextResponse.json({
      status: "disponivel", historicoDisponivel: true,
      ultimoCicloEm: snapshots[0]?.createdAt ?? null,
      ciclos: snapshots, mudancas: changes,
      observacao: "Registros de coletas periódicas; não são alertas em tempo real."
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[NeuroTwin historico] Erro ao consultar", error);
    return NextResponse.json({
      status: "indisponivel", motivo: "banco_ou_migracao_pendente",
      historicoDisponivel: false, ciclos: [], mudancas: []
    }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
