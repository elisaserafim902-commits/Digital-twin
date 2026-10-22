import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type EarthquakeFeature = {
  id: string;
  properties: { mag: number | null; place: string | null; time: number; url: string; depth?: number };
  geometry: { coordinates: number[] };
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = String(body.message ?? body.mensagem ?? "").trim();
    if (!message) return NextResponse.json({ status: "error", reply: "Informe um comando." }, { status: 400 });

    const normalized = message.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const earthquakeCommand = /terremot|sism|earthquake|epicentro/.test(normalized);
    if (earthquakeCommand) {
      const endpoint = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
      const response = await fetch(endpoint, { cache: "no-store", signal: AbortSignal.timeout(12000) });
      if (!response.ok) throw new Error("USGS HTTP " + response.status);
      const payload = await response.json() as { features?: EarthquakeFeature[]; metadata?: { generated?: number } };
      const features = (payload.features ?? []).filter(f =>
        Array.isArray(f.geometry?.coordinates) &&
        f.geometry.coordinates.length >= 3 &&
        Number.isFinite(f.geometry.coordinates[0]) &&
        Number.isFinite(f.geometry.coordinates[1]) &&
        Number.isFinite(f.properties?.time)
      );
      const strongest = /mais forte|maior magnitude|mais intenso/.test(normalized);
      const ordered = [...features].sort((a, b) =>
        strongest ? (b.properties.mag ?? -1) - (a.properties.mag ?? -1) : b.properties.time - a.properties.time
      );
      const event = ordered[0];
      if (!event) return NextResponse.json({ status: "ok", reply: "Nenhum terremoto encontrado no feed das últimas 24 horas do USGS. Isso não significa ausência global de atividade.", source: "USGS", observedAt: new Date().toISOString() });
      const [lng, lat, depthKm] = event.geometry.coordinates;
      const time = new Date(event.properties.time).toISOString();
      const reply = [
        strongest ? "Terremoto de maior magnitude no feed USGS das últimas 24 horas:" : "Terremoto mais recente no feed USGS das últimas 24 horas:",
        "Local: " + (event.properties.place || "Não informado"),
        "Magnitude: " + (event.properties.mag ?? "não informada"),
        "Profundidade: " + depthKm + " km",
        "Latitude: " + lat.toFixed(4) + "°, longitude: " + lng.toFixed(4) + "°",
        "Ocorrência (UTC): " + time,
        "Fonte: USGS. Dados sujeitos a revisão. A causa específica e o risco local exigem análise adicional.",
      ].join("\n");
      return NextResponse.json({
        status: "ok", message, reply, source: "USGS", observedAt: new Date().toISOString(),
        sourceGeneratedAt: payload.metadata?.generated ? new Date(payload.metadata.generated).toISOString() : null,
        event: { id: event.id, lat, lng, depthKm, magnitude: event.properties.mag, place: event.properties.place, time, url: event.properties.url },
        action: { type: "FOCUS_GLOBE", lat, lng, altitude: 0.62 },
      });
    }
    return NextResponse.json({
      status: "ok", message,
      reply: "Comando recebido. Para uma consulta sísmica real, diga: 'Twin, mostre o terremoto mais recente' ou 'Twin, mostre o terremoto mais forte'. Outras ações ainda dependem de integrações verificadas.",
    });
  } catch (error) {
    console.error("NeuroTwin command error:", error);
    return NextResponse.json({ status: "error", reply: "Não foi possível obter dados confirmados agora. Nenhum evento foi inventado." }, { status: 503 });
  }
}
