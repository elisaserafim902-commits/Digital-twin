import { NextResponse } from "next/server";
import { consultarGDACS } from "../../../lib/providers/gdacs";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/*
=========================================================
NEUROTWIN 2050 - OBSERVATORIO GLOBAL
Camada resiliente de integracao
=========================================================
*/

type FetchOptions = {
timeoutMs?: number;
retries?: number;
};

function esperar(ms: number) {
return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJSON(
url: string,
options: FetchOptions = {}
) {
const timeoutMs = options.timeoutMs ?? 8000;
const retries = options.retries ?? 1;

let ultimoErro: unknown;

for (let tentativa = 0; tentativa <= retries; tentativa++) {
const controller = new AbortController();

const timeout = setTimeout(() => {
controller.abort();
}, timeoutMs);

try {
const response = await fetch(url, {
cache: "no-store",
signal: controller.signal,
headers: {
"User-Agent": "NeuroTwin-2050/2.0",
Accept: "application/json",
},
});

clearTimeout(timeout);

if (!response.ok) {
throw new Error(
`Falha HTTP ${response.status} em ${url}`
);
}

return await response.json();
} catch (error) {
clearTimeout(timeout);
ultimoErro = error;

if (tentativa < retries) {
await esperar(600 * (tentativa + 1));
}
}
}

throw ultimoErro;
}

export async function GET() {
const agora = new Date().toISOString();

const resultado: any = {
status: "online",
atualizadoEm: agora,

fontes: {
usgs: {
status: "carregando",
descricao: "USGS Earthquake Hazards Program",
},

nasaEonet: {
status: "carregando",
descricao:
"NASA Earth Observatory Natural Event Tracker",
},

gdacs: {
status: "carregando",
descricao:
"GDACS - Global Disaster Alert and Coordination System",
},
},

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

/*
=========================================================
USGS - TERREMOTOS
=========================================================
*/

try {
const usgs = await fetchJSON(
"https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson",
{
timeoutMs: 8000,
retries: 1,
}
);

const features = Array.isArray(usgs?.features)
? usgs.features
: [];

resultado.terremotos = features
.map((item: any) => ({
id: item?.id || null,

magnitude:
typeof item?.properties?.mag === "number"
? item.properties.mag
: 0,

local:
item?.properties?.place ||
"Local nao informado",

horario:
item?.properties?.time || null,

url:
item?.properties?.url || null,

tsunami:
item?.properties?.tsunami === 1,

tipo:
item?.properties?.type ||
"earthquake",

coordenadas:
Array.isArray(item?.geometry?.coordinates)
? item.geometry.coordinates
: null,

fonte: "USGS",
}))
.filter(
(item: any) =>
Array.isArray(item.coordenadas) &&
item.coordenadas.length >= 2
)
.slice(0, 100);

resultado.resumo.terremotos24h =
features.length;

resultado.resumo.terremotosFortes24h =
features.filter(
(item: any) =>
Number(item?.properties?.mag || 0) >= 4.5
).length;

resultado.fontes.usgs = {
status: "online",
descricao:
"USGS Earthquake Hazards Program",
atualizadoEm: agora,
};
} catch (error) {
console.error(
"NeuroTwin - falha USGS:",
error
);

resultado.fontes.usgs = {
status: "offline",
descricao:
"USGS temporariamente indisponivel",
atualizadoEm: agora,
};
}

/*
=========================================================
NASA EONET - EVENTOS NATURAIS
=========================================================
*/

try {
const eonet = await fetchJSON(
"https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=50",
{
timeoutMs: 7000,
retries: 1,
}
);

const eventos = Array.isArray(eonet?.events)
? eonet.events
: [];

resultado.eventosNaturais = eventos
.map((event: any) => {
const geometries = Array.isArray(
event?.geometry
)
? event.geometry
: [];

const ultimaGeometria =
geometries.length > 0
? geometries[
geometries.length - 1
]
: null;

return {
id:
event?.id ||
`eonet-${Math.random()}`,

titulo:
event?.title ||
"Evento natural",

descricao:
event?.description || null,

categorias: Array.isArray(
event?.categories
)
? event.categories
.map(
(categoria: any) =>
categoria?.title
)
.filter(Boolean)
: [],

geometria:
ultimaGeometria,

data:
ultimaGeometria?.date ||
null,

coordenadas:
Array.isArray(
ultimaGeometria?.coordinates
)
? ultimaGeometria.coordinates
: null,

fontes: Array.isArray(
event?.sources
)
? event.sources
: [],

fonte: "NASA EONET",
};
})
.filter(
(event: any) =>
event.geometria !== null
);

resultado.resumo.eventosNaturaisAbertos =
resultado.eventosNaturais.length;

resultado.fontes.nasaEonet = {
status: "online",
descricao:
"NASA Earth Observatory Natural Event Tracker",
atualizadoEm: agora,
};
} catch (error: any) {
const tipoErro =
error?.name === "AbortError"
? "timeout"
: "conexao";

console.error(
`NeuroTwin - NASA EONET ${tipoErro}:`,
error
);

/*
IMPORTANTE:
Falha da NASA NAO derruba o Observatorio.
USGS e GDACS continuam funcionando.
*/

resultado.eventosNaturais = [];

resultado.resumo.eventosNaturaisAbertos =
0;

resultado.fontes.nasaEonet = {
status: "offline",
descricao:
tipoErro === "timeout"
? "NASA EONET temporariamente lenta"
: "NASA EONET temporariamente indisponivel",
atualizadoEm: agora,
};
}

/*
=========================================================
GDACS - GLOBAL DISASTER ALERTS
=========================================================
*/

try {
const gdacs = await consultarGDACS();

const eventosGDACS = Array.isArray(
gdacs?.eventos
)
? gdacs.eventos
: [];

resultado.eventosGDACS =
eventosGDACS
.map((evento: any) => ({
...evento,

fonte:
evento?.fonte || "GDACS",

coordenadas:
Array.isArray(
evento?.coordenadas
)
? evento.coordenadas
: null,
}))
.filter(
(evento: any) =>
Array.isArray(
evento.coordenadas
) &&
evento.coordenadas.length >= 2
);

resultado.resumo.eventosGDACS =
Number(gdacs?.total) ||
resultado.eventosGDACS.length;

resultado.fontes.gdacs = {
status:
gdacs?.status || "online",

descricao:
"GDACS - Global Disaster Alert and Coordination System",

atualizadoEm:
gdacs?.atualizadoEm ||
agora,
};
} catch (error) {
console.error(
"NeuroTwin - falha GDACS:",
error
);

resultado.fontes.gdacs = {
status: "offline",

descricao:
"GDACS temporariamente indisponivel",

atualizadoEm: agora,
};

resultado.eventosGDACS = [];

resultado.resumo.eventosGDACS = 0;
}

/*
=========================================================
STATUS GLOBAL
=========================================================
*/

const estados = [
resultado.fontes.usgs.status,
resultado.fontes.nasaEonet.status,
resultado.fontes.gdacs.status,
];

const fontesOnline = estados.filter(
(status) => status === "online"
).length;

if (fontesOnline === 3) {
resultado.status = "online";
} else if (fontesOnline > 0) {
resultado.status = "degradado";
} else {
resultado.status = "offline";
}

resultado.saude = {
fontesOnline,
fontesTotal: 3,

usgs:
resultado.fontes.usgs.status,

nasaEonet:
resultado.fontes.nasaEonet.status,

gdacs:
resultado.fontes.gdacs.status,
};

/*
=========================================================
DADOS GEOESPACIAIS CONSOLIDADOS
=========================================================
*/

resultado.geo = {
terremotos:
resultado.terremotos.length,

eventosNASA:
resultado.eventosNaturais.length,

eventosGDACS:
resultado.eventosGDACS.length,

total:
resultado.terremotos.length +
resultado.eventosNaturais.length +
resultado.eventosGDACS.length,
};

/*
=========================================================
RESPOSTA FINAL
=========================================================
*/

return NextResponse.json(
resultado,
{
status: 200,

headers: {
"Cache-Control":
"no-store, max-age=0",

"X-NeuroTwin":
"Observatorio-Global-2050",
},
}
);
}