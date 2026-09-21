"use client";

import dynamic from "next/dynamic";
import {
useCallback,
useEffect,
useMemo,
useRef,
useState,
} from "react";

const Globe = dynamic(() => import("react-globe.gl"), {
ssr: false,
});

type Categoria =
| "terremoto"
| "tsunami"
| "enchente"
| "incendio"
| "vulcao"
| "ciclone"
| "tempestade"
| "seca"
| "deslizamento"
| "nasa"
| "outro";

type Evento = {
id: string;
titulo: string;
tipo: string;
categoria: Categoria;
lat: number;
lng: number;
severidade: number;
fonte: string;
local?: string;
pais?: string;
magnitude?: number;
nivelAlerta?: string;
horario?: string | number;
tsunami?: boolean;
};

type Props = {
terremotos?: any[];
eventosNaturais?: any[];
eventosGDACS?: any[];
};

type PontoLocal = {
lat: number;
lng: number;
};

const filtros: { key: Categoria; label: string }[] = [
{ key: "terremoto", label: "Terremotos" },
{ key: "tsunami", label: "Tsunamis" },
{ key: "enchente", label: "Enchentes" },
{ key: "incendio", label: "Incêndios" },
{ key: "vulcao", label: "Vulcões" },
{ key: "ciclone", label: "Ciclones" },
{ key: "tempestade", label: "Tempestades" },
{ key: "seca", label: "Secas" },
{ key: "deslizamento", label: "Deslizamentos" },
{ key: "nasa", label: "NASA EONET" },
{ key: "outro", label: "Outros" },
];

function normalizar(valor: unknown) {
return String(valor ?? "")
.normalize("NFD")
.replace(/[\u0300-\u036f]/g, "")
.toLowerCase()
.trim();
}

function categoriaEvento(
texto: unknown,
fonte?: string
): Categoria {
const t = normalizar(texto);

if (t.includes("tsunami")) return "tsunami";

if (
t.includes("earthquake") ||
t.includes("terremoto") ||
t === "eq"
) {
return "terremoto";
}

if (
t.includes("flood") ||
t.includes("enchente") ||
t.includes("inundacao") ||
t === "fl"
) {
return "enchente";
}

if (
t.includes("wildfire") ||
t.includes("forest fire") ||
t.includes("incendio") ||
t === "wf"
) {
return "incendio";
}

if (
t.includes("volcano") ||
t.includes("vulcao") ||
t === "vo"
) {
return "vulcao";
}

if (
t.includes("cyclone") ||
t.includes("hurricane") ||
t.includes("typhoon") ||
t.includes("ciclone") ||
t.includes("furacao") ||
t === "tc"
) {
return "ciclone";
}

if (t.includes("storm") || t.includes("tempestade")) {
return "tempestade";
}

if (
t.includes("drought") ||
t.includes("seca") ||
t === "dr"
) {
return "seca";
}

if (
t.includes("landslide") ||
t.includes("deslizamento")
) {
return "deslizamento";
}

if (fonte === "NASA EONET") return "nasa";

return "outro";
}

function cor(categoria: Categoria) {
const cores: Record<Categoria, string> = {
terremoto: "#ffd400",
tsunami: "#00e5ff",
enchente: "#00a8ff",
incendio: "#ff3d00",
vulcao: "#ff1744",
ciclone: "#c084fc",
tempestade: "#7c3aed",
seca: "#d4a017",
deslizamento: "#a16207",
nasa: "#22d3ee",
outro: "#22c55e",
};

return cores[categoria];
}

function nomeCategoria(categoria: Categoria) {
return (
filtros.find((item) => item.key === categoria)?.label ||
"Outro"
);
}

function dataPtBr(valor?: string | number) {
if (!valor) return "Não informado";

const data = new Date(valor);

if (Number.isNaN(data.getTime())) {
return String(valor);
}

return data.toLocaleString("pt-BR");
}

function rad(graus: number) {
return (graus * Math.PI) / 180;
}

function distanciaKm(
lat1: number,
lng1: number,
lat2: number,
lng2: number
) {
const r = 6371;
const dLat = rad(lat2 - lat1);
const dLng = rad(lng2 - lng1);

const a =
Math.sin(dLat / 2) ** 2 +
Math.cos(rad(lat1)) *
Math.cos(rad(lat2)) *
Math.sin(dLng / 2) ** 2;

return (
r *
2 *
Math.atan2(
Math.sqrt(a),
Math.sqrt(1 - a)
)
);
}

export default function GloboOperacional({
terremotos = [],
eventosNaturais = [],
eventosGDACS = [],
}: Props) {
const globeRef = useRef<any>(null);

const [selecionado, setSelecionado] =
useState<Evento | null>(null);

const [pontoLocal, setPontoLocal] =
useState<PontoLocal | null>(null);

const [raio, setRaio] =
useState<100 | 500 | 1000>(500);

const [somenteCriticos, setSomenteCriticos] =
useState(false);

const [indiceCritico, setIndiceCritico] =
useState(-1);

const [rotacao, setRotacao] =
useState(true);

const [categoriasAtivas, setCategoriasAtivas] =
useState<Set<Categoria>>(
new Set(filtros.map((f) => f.key))
);

const eventos = useMemo<Evento[]>(() => {
const lista: Evento[] = [];

terremotos.forEach((item: any) => {
if (
!Array.isArray(item?.coordenadas) ||
item.coordenadas.length < 2
) {
return;
}

const lng = Number(item.coordenadas[0]);
const lat = Number(item.coordenadas[1]);

if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
return;
}

const magnitude = Number(item?.magnitude || 0);

const tsunami =
item?.tsunami === true ||
item?.tsunami === 1;

const severidade =
tsunami
? 10
: magnitude >= 7
? 10
: magnitude >= 6
? 8
: magnitude >= 5
? 6
: magnitude >= 4.5
? 5
: magnitude >= 4
? 4
: 2;

lista.push({
id: String(item?.id || `usgs-${lat}-${lng}`),
titulo: item?.local || "Atividade sísmica",
tipo: tsunami
? "Terremoto com indicação de tsunami"
: "Terremoto",
categoria: tsunami ? "tsunami" : "terremoto",
lat,
lng,
severidade,
fonte: "USGS",
local: item?.local,
magnitude,
horario: item?.horario,
tsunami,
});
});

eventosNaturais.forEach((item: any) => {
const geo = item?.geometria;

const coordenadas =
Array.isArray(geo?.coordinates)
? geo.coordinates
: Array.isArray(item?.coordenadas)
? item.coordenadas
: Array.isArray(geo)
? geo
: null;

if (!coordenadas || coordenadas.length < 2) {
return;
}

const lng = Number(coordenadas[0]);
const lat = Number(coordenadas[1]);

if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
return;
}

const categorias = Array.isArray(item?.categorias)
? item.categorias.map(String)
: [];

const categoria = categoriaEvento(
`${categorias.join(" ")} ${item?.titulo || ""}`,
"NASA EONET"
);

const severidade =
categoria === "vulcao" ||
categoria === "ciclone" ||
categoria === "incendio"
? 5
: 3;

lista.push({
id: String(item?.id || `nasa-${lat}-${lng}`),
titulo:
item?.titulo ||
nomeCategoria(categoria),
tipo:
categorias.join(", ") ||
nomeCategoria(categoria),
categoria,
lat,
lng,
severidade,
fonte: "NASA EONET",
horario:
item?.data ||
geo?.date,
});
});

eventosGDACS.forEach((item: any) => {
if (
!Array.isArray(item?.coordenadas) ||
item.coordenadas.length < 2
) {
return;
}

const lng = Number(item.coordenadas[0]);
const lat = Number(item.coordenadas[1]);

if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
return;
}

const nivel = normalizar(item?.nivelAlerta);

const categoria = categoriaEvento(
`${item?.tipo || ""} ${item?.nome || ""}`,
"GDACS"
);

const severidade =
nivel === "red"
? 10
: nivel === "orange"
? 8
: 4;

lista.push({
id: String(item?.id || `gdacs-${lat}-${lng}`),
titulo:
item?.nome ||
nomeCategoria(categoria),
tipo:
item?.tipo ||
nomeCategoria(categoria),
categoria,
lat,
lng,
severidade,
fonte: "GDACS",
pais: item?.pais,
nivelAlerta: item?.nivelAlerta,
horario: item?.inicio,
});
});

return lista;
}, [
terremotos,
eventosNaturais,
eventosGDACS,
]);

const eventosFiltrados = useMemo(() => {
return eventos.filter((evento) => {
if (!categoriasAtivas.has(evento.categoria)) {
return false;
}

if (somenteCriticos && evento.severidade < 5) {
return false;
}

return true;
});
}, [
eventos,
categoriasAtivas,
somenteCriticos,
]);

const eventosCriticos = useMemo(() => {
const criticos = eventosFiltrados
.filter((evento) => evento.severidade >= 5)
.sort((a, b) => b.severidade - a.severidade);

if (criticos.length > 0) {
return criticos;
}

return eventosFiltrados
.filter((evento) => evento.severidade >= 4)
.sort((a, b) => b.severidade - a.severidade);
}, [eventosFiltrados]);

const timeline = useMemo(() => {
return [...eventosFiltrados]
.filter((evento) => evento.horario)
.sort((a, b) => {
const da = new Date(a.horario as any).getTime();
const db = new Date(b.horario as any).getTime();

return db - da;
})
.slice(0, 12);
}, [eventosFiltrados]);

const analiseLocal = useMemo(() => {
if (!pontoLocal) {
return null;
}

const encontrados = eventos
.map((evento) => ({
...evento,
distancia: distanciaKm(
pontoLocal.lat,
pontoLocal.lng,
evento.lat,
evento.lng
),
}))
.filter((evento) => evento.distancia <= raio)
.sort((a, b) => a.distancia - b.distancia);

const criticos = encontrados.filter(
(evento) => evento.severidade >= 5
);

const usgs = encontrados.filter(
(evento) => evento.fonte === "USGS"
).length;

const nasa = encontrados.filter(
(evento) => evento.fonte === "NASA EONET"
).length;

const gdacs = encontrados.filter(
(evento) => evento.fonte === "GDACS"
).length;

const maiorSismo =
encontrados
.filter(
(evento) =>
evento.categoria === "terremoto" ||
evento.categoria === "tsunami"
)
.sort(
(a, b) =>
Number(b.magnitude || 0) -
Number(a.magnitude || 0)
)[0] || null;

return {
encontrados,
criticos,
usgs,
nasa,
gdacs,
maiorSismo,
};
}, [
pontoLocal,
raio,
eventos,
]);

const aneis = useMemo(() => {
const lista: any[] = eventosCriticos
.slice(0, 60)
.map((evento) => ({
...evento,
destaque:
selecionado?.id === evento.id,
}));

if (pontoLocal) {
lista.unshift({
id: "ponto-local",
lat: pontoLocal.lat,
lng: pontoLocal.lng,
categoria: "nasa",
severidade: 10,
pontoLocal: true,
});
}

return lista;
}, [
eventosCriticos,
selecionado,
pontoLocal,
]);

const moverCamera = useCallback(
(
lat: number,
lng: number,
altitude = 0.65
) => {
window.setTimeout(() => {
const globe = globeRef.current;

if (
!globe ||
typeof globe.pointOfView !== "function"
) {
return;
}

const controls = globe.controls?.();

if (controls) {
controls.autoRotate = false;
}

globe.pointOfView(
{
lat,
lng,
altitude,
},
1400
);
}, 60);
},
[]
);

const selecionarEvento = useCallback(
(evento: Evento) => {
setPontoLocal(null);
setSelecionado(evento);
setRotacao(false);

moverCamera(
evento.lat,
evento.lng,
0.62
);
},
[moverCamera]
);

const explorarLocal = useCallback(
(lat: number, lng: number) => {
if (
!Number.isFinite(lat) ||
!Number.isFinite(lng)
) {
return;
}

setSelecionado(null);
setIndiceCritico(-1);
setRotacao(false);

setPontoLocal({
lat,
lng,
});

moverCamera(
lat,
lng,
0.58
);
},
[moverCamera]
);

useEffect(() => {
const globe = globeRef.current;

if (!globe) {
return;
}

const controls = globe.controls?.();

if (!controls) {
return;
}

controls.autoRotate = rotacao;
controls.autoRotateSpeed = 0.22;
controls.enableDamping = true;
controls.dampingFactor = 0.08;
}, [rotacao]);

function proximoCritico() {
if (eventosCriticos.length === 0) {
window.alert(
"Nenhum evento crítico disponível neste momento."
);
return;
}

const proximo =
indiceCritico < 0
? 0
: (indiceCritico + 1) %
eventosCriticos.length;

setIndiceCritico(proximo);

selecionarEvento(
eventosCriticos[proximo]
);
}

function alternarCategoria(categoria: Categoria) {
setCategoriasAtivas((atual) => {
const novo = new Set(atual);

if (novo.has(categoria)) {
novo.delete(categoria);
} else {
novo.add(categoria);
}

return novo;
});

setSelecionado(null);
setPontoLocal(null);
setIndiceCritico(-1);
}

function visaoGlobal() {
setSelecionado(null);
setPontoLocal(null);
setIndiceCritico(-1);
setSomenteCriticos(false);
setRotacao(true);

setCategoriasAtivas(
new Set(filtros.map((f) => f.key))
);

window.setTimeout(() => {
const globe = globeRef.current;

if (
!globe ||
typeof globe.pointOfView !== "function"
) {
return;
}

globe.pointOfView(
{
lat: 8,
lng: -30,
altitude: 2,
},
900
);
}, 100);
}

function globoPronto() {
const globe = globeRef.current;

if (!globe) {
return;
}

const controls = globe.controls?.();

if (controls) {
controls.autoRotate = true;
controls.autoRotateSpeed = 0.22;
controls.enableDamping = true;
}

globe.pointOfView(
{
lat: 8,
lng: -30,
altitude: 2,
},
0
);
}

return (
<div className="nt-shell">
<style>{`
.nt-shell {
width: 100%;
color: white;
}

.nt-controls {
display: flex;
flex-wrap: wrap;
gap: 8px;
margin-bottom: 14px;
}

.nt-btn {
border-radius: 999px;
padding: 9px 13px;
cursor: pointer;
font-size: 11px;
border: 1px solid rgba(70,140,255,.32);
background: rgba(3,14,37,.88);
color: #8faad0;
}

.nt-btn.active {
color: white;
border-color: rgba(0,213,255,.75);
background: rgba(0,95,180,.34);
}

.nt-btn.critical {
color: #ffd59d;
border-color: rgba(255,145,0,.6);
background: rgba(100,40,0,.45);
font-weight: 800;
}

.nt-globe {
position: relative;
width: 100%;
height: 700px;
overflow: hidden;
border-radius: 28px;
border: 1px solid rgba(0,170,255,.34);
background:
radial-gradient(
circle at center,
rgba(0,95,255,.28),
rgba(2,6,23,.98) 65%
);
}

.nt-top {
position: absolute;
z-index: 10;
top: 20px;
left: 22px;
right: 22px;
display: flex;
justify-content: space-between;
pointer-events: none;
}

.nt-top small {
display: block;
color: #39a8ff;
font-size: 10px;
font-weight: 900;
letter-spacing: 1.5px;
}

.nt-top strong {
display: block;
margin-top: 4px;
font-size: 21px;
}

.nt-count {
padding: 8px 12px;
border-radius: 999px;
border: 1px solid rgba(0,213,255,.35);
background: rgba(2,12,32,.86);
color: #9ee8ff;
font-size: 11px;
}

.nt-hint {
position: absolute;
z-index: 10;
top: 70px;
left: 22px;
padding: 8px 11px;
border-radius: 10px;
background: rgba(2,12,32,.78);
border: 1px solid rgba(0,213,255,.3);
color: #83dfff;
font-size: 10px;
pointer-events: none;
}

.nt-panel {
position: absolute;
z-index: 20;
left: 20px;
bottom: 20px;
width: min(430px, calc(100% - 40px));
max-height: 570px;
overflow-y: auto;
padding: 20px;
border-radius: 20px;
border: 1px solid rgba(70,160,255,.45);
background:
linear-gradient(
145deg,
rgba(5,22,58,.97),
rgba(2,8,25,.98)
);
box-sizing: border-box;
}

.nt-panel h3 {
margin: 6px 28px 10px 0;
font-size: 20px;
}

.nt-panel p {
margin: 6px 0;
color: #adc4df;
font-size: 12px;
}

.nt-close {
position: absolute;
top: 8px;
right: 12px;
border: 0;
background: transparent;
color: white;
font-size: 22px;
cursor: pointer;
}

.nt-chip {
display: inline-block;
padding: 5px 8px;
border-radius: 999px;
border: 1px solid rgba(255,255,255,.16);
font-size: 10px;
font-weight: 900;
}

.nt-radius {
display: flex;
gap: 7px;
margin: 14px 0;
}

.nt-radius button {
flex: 1;
padding: 8px;
border-radius: 9px;
cursor: pointer;
border: 1px solid rgba(70,150,255,.25);
background: rgba(2,10,28,.8);
color: #93afd0;
}

.nt-radius button.active {
color: white;
border-color: #00e5ff;
background: rgba(0,100,160,.28);
}

.nt-grid {
display: grid;
grid-template-columns: repeat(3,1fr);
gap: 8px;
margin-top: 12px;
}

.nt-stat {
padding: 10px;
border-radius: 10px;
background: rgba(2,9,27,.8);
border: 1px solid rgba(70,150,255,.18);
}

.nt-stat span {
display: block;
color: #7797bd;
font-size: 9px;
}

.nt-stat strong {
display: block;
margin-top: 4px;
font-size: 17px;
}

.nt-near {
margin-top: 13px;
}

.nt-near-item {
padding: 9px 0;
border-bottom: 1px solid rgba(255,255,255,.07);
cursor: pointer;
}

.nt-near-item strong {
display: block;
font-size: 11px;
}

.nt-near-item span {
color: #7fa3cd;
font-size: 10px;
}

.nt-alert {
margin-top: 12px;
padding: 10px;
border-radius: 10px;
color: #ffd09a;
background: rgba(120,50,0,.2);
border: 1px solid rgba(255,145,0,.25);
font-size: 11px;
font-weight: 800;
}

.nt-timeline {
margin-top: 15px;
padding: 18px;
border-radius: 20px;
background: rgba(3,14,37,.86);
border: 1px solid rgba(70,140,255,.22);
}

.nt-time {
display: grid;
grid-template-columns: 170px 1fr 120px 90px;
gap: 12px;
padding: 10px 0;
cursor: pointer;
border-bottom: 1px solid rgba(255,255,255,.06);
color: #b6c8dd;
font-size: 11px;
}

@media (max-width: 760px) {
.nt-globe {
height: 560px;
}

.nt-panel {
left: 12px;
bottom: 12px;
width: calc(100% - 24px);
max-height: 450px;
}

.nt-grid {
grid-template-columns: 1fr 1fr;
}

.nt-time {
grid-template-columns: 1fr;
gap: 4px;
}
}
`}</style>

<div className="nt-controls">
{filtros.map((item) => (
<button
type="button"
key={item.key}
className={`nt-btn ${
categoriasAtivas.has(item.key)
? "active"
: ""
}`}
onClick={() =>
alternarCategoria(item.key)
}
>
{item.label}
</button>
))}

<button
type="button"
className={`nt-btn ${
somenteCriticos ? "active" : ""
}`}
onClick={() =>
setSomenteCriticos((v) => !v)
}
>
Somente críticos
</button>

<button
type="button"
className="nt-btn critical"
onClick={proximoCritico}
>
Próximo crítico
</button>

<button
type="button"
className="nt-btn"
onClick={visaoGlobal}
>
Visão global
</button>
</div>

<div className="nt-globe">
<div className="nt-top">
<div>
<small>
NEUROTWIN GEOINTELLIGENCE
</small>

<strong>
Globo Operacional 3D
</strong>
</div>

<div className="nt-count">
{eventosFiltrados.length} eventos ·{" "}
{eventosCriticos.length} críticos
</div>
</div>

{!selecionado && !pontoLocal && (
<div className="nt-hint">
TOQUE EM QUALQUER PONTO DO PLANETA PARA ANÁLISE LOCAL
</div>
)}

<Globe
ref={globeRef}
onGlobeReady={globoPronto}
height={700}
backgroundColor="rgba(0,0,0,0)"
globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
showAtmosphere={true}
showGraticules={true}
atmosphereColor="#1687ff"
atmosphereAltitude={0.2}

pointsData={eventosFiltrados}
pointLat={(d: any) => d.lat}
pointLng={(d: any) => d.lng}

pointAltitude={(d: any) =>
selecionado?.id === d.id
? 0.12
: 0.03
}

pointRadius={(d: any) =>
selecionado?.id === d.id
? 0.8
: 0.2 +
Number(d.severidade || 1) * 0.05
}

pointColor={(d: any) =>
selecionado?.id === d.id
? "#ffffff"
: cor(d.categoria)
}

pointLabel={(d: any) => `
<div style="
padding:10px;
background:rgba(2,8,24,.96);
color:white;
border-radius:10px;
">
<strong>${String(d.titulo)}</strong>
<br/>
${nomeCategoria(d.categoria)}
<br/>
Severidade: ${String(d.severidade)}/10
<br/>
Fonte: ${String(d.fonte)}
</div>
`}

onPointClick={(d: any) =>
selecionarEvento(d as Evento)
}

onGlobeClick={(coords: any) => {
if (!coords) return;

explorarLocal(
Number(coords.lat),
Number(coords.lng)
);
}}

ringsData={aneis}
ringLat={(d: any) => d.lat}
ringLng={(d: any) => d.lng}

ringColor={(d: any) =>
d.pontoLocal
? [
"#ffffff",
"#00e5ff",
"rgba(0,0,0,0)",
]
: d.destaque
? [
"#ffffff",
cor(d.categoria),
"rgba(0,0,0,0)",
]
: [
cor(d.categoria),
"rgba(0,0,0,0)",
]
}

ringMaxRadius={(d: any) =>
d.pontoLocal || d.destaque
? 7
: 3
}

ringPropagationSpeed={(d: any) =>
d.pontoLocal || d.destaque
? 5
: 2
}

ringRepeatPeriod={(d: any) =>
d.pontoLocal || d.destaque
? 450
: 900
}
/>

{selecionado && (
<div className="nt-panel">
<button
className="nt-close"
onClick={() => {
setSelecionado(null);
setRotacao(true);
}}
>
×
</button>

<span
className="nt-chip"
style={{
color: cor(
selecionado.categoria
),
}}
>
{nomeCategoria(
selecionado.categoria
)}
</span>

<h3>
{selecionado.titulo}
</h3>

<p>Evento: {selecionado.tipo}</p>

{selecionado.local && (
<p>Local: {selecionado.local}</p>
)}

{selecionado.pais && (
<p>País: {selecionado.pais}</p>
)}

{selecionado.magnitude !== undefined && (
<p>
Magnitude:{" "}
{selecionado.magnitude.toFixed(1)}
</p>
)}

<p>
Horário:{" "}
{dataPtBr(selecionado.horario)}
</p>

<p>
Coordenadas:{" "}
{selecionado.lat.toFixed(4)},{" "}
{selecionado.lng.toFixed(4)}
</p>

<p>Fonte: {selecionado.fonte}</p>

<div className="nt-alert">
Severidade operacional:{" "}
{selecionado.severidade}/10
</div>
</div>
)}

{pontoLocal && analiseLocal && (
<div className="nt-panel">
<button
className="nt-close"
onClick={() => {
setPontoLocal(null);
setRotacao(true);
}}
>
×
</button>

<span className="nt-chip">
ANÁLISE LOCAL
</span>

<h3>
Inteligência Geoespacial
</h3>

<p>
Latitude: {pontoLocal.lat.toFixed(5)}
</p>

<p>
Longitude: {pontoLocal.lng.toFixed(5)}
</p>

<div className="nt-radius">
<button
className={raio === 100 ? "active" : ""}
onClick={() => setRaio(100)}
>
100 km
</button>

<button
className={raio === 500 ? "active" : ""}
onClick={() => setRaio(500)}
>
500 km
</button>

<button
className={raio === 1000 ? "active" : ""}
onClick={() => setRaio(1000)}
>
1.000 km
</button>
</div>

<div className="nt-grid">
<div className="nt-stat">
<span>EVENTOS</span>
<strong>
{analiseLocal.encontrados.length}
</strong>
</div>

<div className="nt-stat">
<span>CRÍTICOS</span>
<strong>
{analiseLocal.criticos.length}
</strong>
</div>

<div className="nt-stat">
<span>USGS</span>
<strong>{analiseLocal.usgs}</strong>
</div>

<div className="nt-stat">
<span>NASA</span>
<strong>{analiseLocal.nasa}</strong>
</div>

<div className="nt-stat">
<span>GDACS</span>
<strong>{analiseLocal.gdacs}</strong>
</div>

<div className="nt-stat">
<span>RAIO</span>
<strong>{raio} km</strong>
</div>
</div>

{analiseLocal.maiorSismo && (
<div className="nt-alert">
Maior sismo no raio: M
{Number(
analiseLocal.maiorSismo.magnitude || 0
).toFixed(1)}
{" · "}
{analiseLocal.maiorSismo.titulo}
</div>
)}

<div className="nt-near">
{analiseLocal.encontrados
.slice(0, 10)
.map((evento) => (
<div
key={`near-${evento.id}`}
className="nt-near-item"
onClick={() =>
selecionarEvento(evento)
}
>
<strong>
{evento.titulo}
</strong>

<span>
{Math.round(evento.distancia)} km ·{" "}
{evento.fonte} ·{" "}
{nomeCategoria(evento.categoria)}
</span>
</div>
))}

{analiseLocal.encontrados.length === 0 && (
<p>
Nenhuma ocorrência integrada localizada nesse raio.
</p>
)}
</div>
</div>
)}
</div>

<div className="nt-timeline">
<h3>Linha do Tempo Operacional</h3>

{timeline.map((evento) => (
<div
key={`time-${evento.id}`}
className="nt-time"
onClick={() =>
selecionarEvento(evento)
}
>
<span>
{dataPtBr(evento.horario)}
</span>

<span>{evento.titulo}</span>

<span>
{nomeCategoria(evento.categoria)}
</span>

<span>{evento.fonte}</span>
</div>
))}
</div>
</div>
);
}