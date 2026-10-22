import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { GET as consultarObservatorio } from "../../observatorio/route";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type EventInput = {
  source: string;
  sourceEventId: string;
  title: string;
  eventType: string | null;
  latitude: number | null;
  longitude: number | null;
  magnitude: number | null;
  lastReportedAt: Date | null;
};

function safeDate(value: unknown): Date | null {
  if (value === null || value === undefined || value === "") return null;
  const date = new Date(value as string | number);
  return Number.isFinite(date.getTime()) ? date : null;
}

function safeNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function normalize(data: any): EventInput[] {
  const items: EventInput[] = [];
  const append = (source: string, events: any[], mapper: (event: any) => Omit<EventInput, "source">) => {
    for (const event of events) {
      const mapped = mapper(event);
      if (!mapped.sourceEventId || mapped.sourceEventId === "sem-id") continue;
      items.push({ source, ...mapped });
    }
  };
  if (data?.fontes?.usgs?.status === "online") {
    append("usgs", data.terremotos || [], e => ({
      sourceEventId: String(e.id || ""), title: String(e.local || "Terremoto"),
      eventType: String(e.tipo || "earthquake"),
      longitude: safeNumber(e.coordenadas?.[0]), latitude: safeNumber(e.coordenadas?.[1]),
      magnitude: safeNumber(e.magnitude), lastReportedAt: safeDate(e.horario)
    }));
  }
  if (data?.fontes?.nasaEonet?.status === "online") {
    append("nasaEonet", data.eventosNaturais || [], e => ({
      sourceEventId: String(e.id || ""), title: String(e.titulo || "Evento natural"),
      eventType: Array.isArray(e.categorias) ? e.categorias.join(", ").slice(0,250) : null,
      longitude: safeNumber(e.coordenadas?.[0]), latitude: safeNumber(e.coordenadas?.[1]),
      magnitude: null, lastReportedAt: safeDate(e.data)
    }));
  }
  if (data?.fontes?.gdacs?.status === "online") {
    append("gdacs", data.eventosGDACS || [], e => ({
      sourceEventId: String(e.id || ""), title: String(e.nome || "Alerta GDACS"),
      eventType: String(e.tipo || "desconhecido"),
      longitude: safeNumber(e.coordenadas?.[0]), latitude: safeNumber(e.coordenadas?.[1]),
      magnitude: null, lastReportedAt: safeDate(e.inicio)
    }));
  }
  // Fontes podem ser truncadas. Ausência não implica encerramento.
  return Array.from(new Map(items.map(e => [e.source + ":" + e.sourceEventId, e])).values()).slice(0, 250);
}

/**
 * Autonomous Core v0.2: coleta autenticada, histórico e mudanças observadas.
 * Nenhuma ausência no feed é interpretada como encerramento do fenômeno.
 * Requer DATABASE_URL com migração Prisma aplicada e CRON_SECRET.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ status: "nao_configurado", erro: "CRON_SECRET ausente" }, { status: 503 });
  if (request.headers.get("authorization") !== "Bearer " + secret) {
    return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });
  }
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ status: "nao_configurado", erro: "DATABASE_URL ausente" }, { status: 503 });
  }
  const started = Date.now();
  try {
    const response = await consultarObservatorio();
    if (!response.ok) throw new Error("Observatorio HTTP " + response.status);
    const data = await response.json();
    const sources = ["usgs", "nasaEonet", "gdacs"].map(name => ({
      name, status: data?.fontes?.[name]?.status || "desconhecido"
    }));
    const online = sources.filter(s => s.status === "online").length;
    const status = online === 3 ? "operacional" : online > 0 ? "degradado" : "indisponivel";
    const events = normalize(data);
    const changes = { novos: 0, atualizados: 0, semAlteracao: 0 };
    const now = new Date();
    // Registra o ciclo e os eventos numa transação: não publica sucesso parcial.
    await prisma.$transaction(async tx => {
      await tx.observatorySnapshot.create({ data: {
        status, totalEvents: events.length,
        sourcesJson: JSON.stringify(sources),
        summaryJson: JSON.stringify(data?.resumo || {})
      } });
      for (const event of events) {
        const existing = await tx.observatoryEvent.findUnique({
          where: { source_sourceEventId: { source: event.source, sourceEventId: event.sourceEventId } }
        });
        if (!existing) {
          const created = await tx.observatoryEvent.create({ data: { ...event, lastSeenAt: now } });
          await tx.observatoryChange.create({ data: {
            eventId: created.id, changeType: "primeira_observacao",
            detailsJson: JSON.stringify({ source: event.source, sourceEventId: event.sourceEventId })
          } });
          changes.novos++;
          continue;
        }
        const changed = existing.title !== event.title ||
          existing.eventType !== event.eventType ||
          existing.magnitude !== event.magnitude ||
          existing.latitude !== event.latitude ||
          existing.longitude !== event.longitude ||
          existing.lastReportedAt?.getTime() !== event.lastReportedAt?.getTime();
        await tx.observatoryEvent.update({ where: { id: existing.id }, data: {
          title: event.title, eventType: event.eventType,
          latitude: event.latitude, longitude: event.longitude,
          magnitude: event.magnitude, lastReportedAt: event.lastReportedAt,
          lastSeenAt: now
        } });
        if (changed) {
          await tx.observatoryChange.create({ data: {
            eventId: existing.id, changeType: "atualizacao_observada",
            detailsJson: JSON.stringify({ source: event.source, sourceEventId: event.sourceEventId })
          } });
          changes.atualizados++;
        } else changes.semAlteracao++;
      }
    }, { timeout: 45000, maxWait: 5000 });
    const result = {
      modulo: "NeuroTwin Autonomous Core", versao: "0.2",
      executadoEm: now.toISOString(), duracaoMs: Date.now() - started,
      status, fontes: sources, eventosProcessados: events.length, mudancas: changes,
      alertasExternosEnviados: 0,
      limitacoes: "Comparação entre observações, não detecção em tempo real. Não interpreta ausência como encerramento. Notificações externas ainda não habilitadas."
    };
    console.info("[NeuroTwin Autonomous Core]", JSON.stringify(result));
    return NextResponse.json(result, {
      status: status === "indisponivel" ? 503 : 200,
      headers: { "Cache-Control": "no-store" }
    });
  } catch (error) {
    console.error("[NeuroTwin Autonomous Core] Falha", error);
    return NextResponse.json({
      modulo: "NeuroTwin Autonomous Core", status: "falha",
      executadoEm: new Date().toISOString(),
      erro: "Não foi possível concluir e persistir o ciclo; verifique banco, migração e fontes."
    }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
