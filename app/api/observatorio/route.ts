import { NextResponse } from "next/server";
import { consultarGDACS } from "../../../lib/providers/gdacs";

export const dynamic = "force-dynamic";

async function fetchJSON(url: string) {
const response = await fetch(url, {
cache: "no-store",
headers: {
"User-Agent": "NeuroTwin-2050/1.0",
},
});

if (!response.ok) {
throw new Error(`Falha HTTP ${response.status}`);
}

return response.json();
}

export async function GET() {
const agora = new Date().toISOString();

const resultado: any = {
status: "online",
atualizadoEm: agora,

fontes: {},

terremotos: [],
eventosNaturais: [],
eventosGDACS: [],

resumo: {
terremotos24h: 0,
terremotosFortes24h: 0,
eventosNaturaisAbertos: 0,
eventosGDACS: 0,
},
};

// =========================================================
// USGS - TERREMOTOS
// =========================================================

try {
const usgs = await fetchJSON(
"https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
);

resultado.terremotos = (usgs.features || [])
.map((item: any) => ({
id: item.id,
magnitude: item.properties?.mag,
local: item.properties?.place,
horario: item.properties?.time,
url: item.properties?.url,
coordenadas: item.geometry?.coordinates,
fonte: "USGS",
}))
.slice(0, 50);

resultado.resumo.terremotos24h =
usgs.features?.length || 0;

resultado.resumo.terremotosFortes24h =
usgs.features?.filter(
(item: any) => (item.properties?.mag || 0) >= 4.5
).length || 0;

resultado.fontes.usgs = {
status: "online",
descricao: "USGS Earthquake Hazards Program",
};
} catch (error) {
console.error("Erro USGS:", error);

resultado.fontes.usgs = {
status: "erro",
descricao: "USGS Earthquake Hazards Program",
};
}

// =========================================================
// NASA EONET - EVENTOS NATURAIS
// =========================================================

try {
const eonet = await fetchJSON(
"https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=50"
);

resultado.eventosNaturais = (eonet.events || []).map(
(event: any) => ({
id: event.id,
titulo: event.title,
descricao: event.description || null,

categorias: (event.categories || []).map(
(categoria: any) => categoria.title
),

geometria:
event.geometry?.[event.geometry.length - 1] || null,

fontes: event.sources || [],

fonte: "NASA EONET",
})
);

resultado.resumo.eventosNaturaisAbertos =
resultado.eventosNaturais.length;

resultado.fontes.nasaEonet = {
status: "online",
descricao: "NASA EONET",
};
} catch (error) {
console.error("Erro NASA EONET:", error);

resultado.fontes.nasaEonet = {
status: "erro",
descricao: "NASA EONET",
};
}

// =========================================================
// GDACS - GLOBAL DISASTER ALERTS
// =========================================================

try {
const gdacs = await consultarGDACS();

resultado.eventosGDACS = gdacs.eventos || [];

resultado.resumo.eventosGDACS =
gdacs.total || resultado.eventosGDACS.length;

resultado.fontes.gdacs = {
status: gdacs.status || "online",
descricao:
"GDACS - Global Disaster Alert and Coordination System",
atualizadoEm: gdacs.atualizadoEm || agora,
};
} catch (error) {
console.error("Erro GDACS:", error);

resultado.fontes.gdacs = {
status: "erro",
descricao:
"GDACS - Global Disaster Alert and Coordination System",
};

resultado.eventosGDACS = [];
resultado.resumo.eventosGDACS = 0;
}

// =========================================================
// RESPOSTA FINAL DO OBSERVATORIO
// =========================================================

return NextResponse.json(resultado);
}