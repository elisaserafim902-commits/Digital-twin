import { NextResponse } from "next/server";

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
resumo: {
terremotos24h: 0,
terremotosFortes24h: 0,
eventosNaturaisAbertos: 0,
},
};

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
}))
.slice(0, 50);

resultado.resumo.terremotos24h = usgs.features?.length || 0;

resultado.resumo.terremotosFortes24h =
usgs.features?.filter((item: any) => (item.properties?.mag || 0) >= 4.5)
.length || 0;

resultado.fontes.usgs = {
status: "online",
descricao: "USGS Earthquake Hazards Program",
};
} catch (error) {
resultado.fontes.usgs = {
status: "erro",
descricao: "USGS Earthquake Hazards Program",
};
}

try {
const eonet = await fetchJSON(
"https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=50"
);

resultado.eventosNaturais = (eonet.events || []).map((event: any) => ({
id: event.id,
titulo: event.title,
descricao: event.description || null,
categorias: (event.categories || []).map((c: any) => c.title),
geometria: event.geometry?.[event.geometry.length - 1] || null,
fontes: event.sources || [],
}));

resultado.resumo.eventosNaturaisAbertos =
resultado.eventosNaturais.length;

resultado.fontes.nasaEonet = {
status: "online",
descricao: "NASA EONET",
};
} catch (error) {
resultado.fontes.nasaEonet = {
status: "erro",
descricao: "NASA EONET",
};
}

return NextResponse.json(resultado);
}