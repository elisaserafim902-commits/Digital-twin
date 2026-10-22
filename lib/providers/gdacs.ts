export type GdacsEvent = {
id: string;
episodeId: string | null;
tipo: string;
nome: string;
nivelAlerta: string | null;
pontuacaoAlerta: number | null;
pais: string | null;
inicio: string | null;
fim: string | null;
coordenadas: any;
fonte: "GDACS";
};

export async function consultarGDACS(): Promise<{
status: "online" | "erro";
atualizadoEm: string;
total: number;
eventos: GdacsEvent[];
erro?: string;
}> {
const atualizadoEm = new Date().toISOString();

try {
const response = await fetch(
"https://www.gdacs.org/gdacsapi/api/events/geteventlist/events4app",
{
cache: "no-store",
headers: {
"User-Agent": "NeuroTwin-2050/2.0",
Accept: "application/json",
},
}
);

if (!response.ok) {
throw new Error(`GDACS HTTP ${response.status}`);
}

const data = await response.json();

const features = Array.isArray(data?.features)
? data.features
: [];

const eventos: GdacsEvent[] = features.map((feature: any) => {
const p = feature?.properties ?? {};

return {
id: String(
p.eventid ??
feature?.id ??
"sem-id"
),

episodeId:
p.episodeid !== undefined
? String(p.episodeid)
: null,

tipo:
p.eventtype ??
p.type ??
"DESCONHECIDO",

nome:
p.name ??
p.eventname ??
p.description ??
"Evento GDACS",

nivelAlerta:
p.alertlevel ??
null,

pontuacaoAlerta:
typeof p.alertscore === "number"
? p.alertscore
: null,

pais:
p.country ??
null,

inicio:
p.fromdate ??
null,

fim:
p.todate ??
null,

coordenadas:
feature?.geometry?.coordinates ??
null,

fonte: "GDACS",
};
});

return {
status: "online",
atualizadoEm,
total: eventos.length,
eventos,
};
} catch (error) {
return {
status: "erro",
atualizadoEm,
total: 0,
eventos: [],
erro:
error instanceof Error
? error.message
: "Falha desconhecida no GDACS",
};
}
}