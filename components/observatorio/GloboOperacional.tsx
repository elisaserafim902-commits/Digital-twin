"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";

const Globe = dynamic(() => import("react-globe.gl"), {
ssr: false,
});

type EventoGlobo = {
id: string;
tipo: string;
titulo: string;
lat: number;
lng: number;
severidade: number;
fonte: string;
local?: string;
pais?: string;
magnitude?: number;
};

type Props = {
terremotos?: any[];
eventosNaturais?: any[];
eventosGDACS?: any[];
};

export default function GloboOperacional({
terremotos = [],
eventosNaturais = [],
eventosGDACS = [],
}: Props) {
const globeRef = useRef<any>(null);

const [selecionado, setSelecionado] =
useState<EventoGlobo | null>(null);

const eventos = useMemo(() => {
const lista: EventoGlobo[] = [];

terremotos.forEach((item: any) => {
const coordenadas = item?.coordenadas;

if (
Array.isArray(coordenadas) &&
coordenadas.length >= 2
) {
const magnitude = Number(
item?.magnitude || 0
);

lista.push({
id: String(item?.id || Math.random()),
tipo: "Terremoto",
titulo:
item?.local || "Terremoto",
lat: Number(coordenadas[1]),
lng: Number(coordenadas[0]),
severidade:
magnitude >= 7
? 8
: magnitude >= 6
? 6
: magnitude >= 5
? 4
: 2,
fonte: "USGS",
local: item?.local,
magnitude,
});
}
});

eventosNaturais.forEach((item: any) => {
const geometria = item?.geometria;

let lat: number | null = null;
let lng: number | null = null;

if (
geometria &&
Array.isArray(geometria.coordinates)
) {
lng = Number(
geometria.coordinates[0]
);

lat = Number(
geometria.coordinates[1]
);
} else if (
Array.isArray(geometria) &&
geometria.length >= 2
) {
lng = Number(geometria[0]);
lat = Number(geometria[1]);
}

if (
lat !== null &&
lng !== null &&
Number.isFinite(lat) &&
Number.isFinite(lng)
) {
const categorias =
Array.isArray(item?.categorias)
? item.categorias
.map(String)
.join(", ")
: "Evento natural";

lista.push({
id: String(
item?.id || Math.random()
),
tipo: categorias,
titulo:
item?.titulo ||
"Evento natural",
lat,
lng,
severidade: 3,
fonte: "NASA EONET",
});
}
});

eventosGDACS.forEach((item: any) => {
const coordenadas = item?.coordenadas;

if (
Array.isArray(coordenadas) &&
coordenadas.length >= 2
) {
const nivel = String(
item?.nivelAlerta || ""
).toLowerCase();

const severidade =
nivel === "red"
? 8
: nivel === "orange"
? 5
: 3;

lista.push({
id: String(
item?.id || Math.random()
),
tipo: String(
item?.tipo ||
"Desastre global"
),
titulo:
item?.nome ||
"Evento GDACS",
lat: Number(coordenadas[1]),
lng: Number(coordenadas[0]),
severidade,
fonte: "GDACS",
pais: item?.pais,
});
}
});

return lista.filter(
(evento) =>
Number.isFinite(evento.lat) &&
Number.isFinite(evento.lng)
);
}, [
terremotos,
eventosNaturais,
eventosGDACS,
]);

useEffect(() => {
const globe = globeRef.current;

if (!globe) return;

const controls =
globe.controls?.();

if (controls) {
controls.autoRotate = true;
controls.autoRotateSpeed = 0.35;
controls.enableDamping = true;
controls.dampingFactor = 0.08;
}

globe.pointOfView(
{
lat: 8,
lng: -25,
altitude: 2.1,
},
0
);
}, []);

function corEvento(
evento: EventoGlobo
) {
if (evento.fonte === "USGS") {
if (
(evento.magnitude || 0) >= 7
) {
return "#ff0033";
}

if (
(evento.magnitude || 0) >= 6
) {
return "#ff4d00";
}

if (
(evento.magnitude || 0) >= 5
) {
return "#ff9f00";
}

return "#ffd43b";
}

if (
evento.fonte === "GDACS"
) {
if (evento.severidade >= 8) {
return "#ff1744";
}

if (evento.severidade >= 5) {
return "#ff9100";
}

return "#22c55e";
}

return "#00d4ff";
}

function selecionar(
evento: EventoGlobo
) {
setSelecionado(evento);

globeRef.current?.pointOfView(
{
lat: evento.lat,
lng: evento.lng,
altitude: 1.35,
},
900
);
}

return (
<div className="globo-container">
<style>{`
.globo-container {
position: relative;
width: 100%;
height: 620px;
overflow: hidden;
border-radius: 26px;
border: 1px solid rgba(0, 180, 255, 0.32);
background:
radial-gradient(
circle at center,
rgba(0, 110, 255, 0.22),
rgba(2, 6, 23, 0.98) 62%
);
box-shadow:
inset 0 0 90px rgba(0, 140, 255, 0.12),
0 0 60px rgba(0, 90, 255, 0.14);
}

.globo-titulo {
position: absolute;
z-index: 5;
top: 22px;
left: 24px;
pointer-events: none;
}

.globo-titulo span {
display: block;
color: #4db8ff;
font-size: 11px;
letter-spacing: 1.5px;
font-weight: 800;
}

.globo-titulo strong {
display: block;
margin-top: 5px;
font-size: 21px;
color: white;
}

.globo-contador {
position: absolute;
z-index: 5;
right: 22px;
top: 22px;
padding: 8px 12px;
border-radius: 999px;
border: 1px solid rgba(0, 213, 255, 0.35);
background: rgba(2, 12, 32, 0.82);
color: #9ee8ff;
font-size: 12px;
pointer-events: none;
}

.globo-legenda {
position: absolute;
z-index: 5;
right: 22px;
bottom: 22px;
display: flex;
gap: 10px;
flex-wrap: wrap;
justify-content: flex-end;
max-width: 320px;
}

.globo-legenda-item {
display: flex;
align-items: center;
gap: 6px;
padding: 6px 9px;
border-radius: 999px;
background: rgba(2, 10, 30, 0.8);
border: 1px solid rgba(80, 160, 255, 0.2);
color: #c6d8ef;
font-size: 10px;
pointer-events: none;
}

.globo-dot {
width: 8px;
height: 8px;
border-radius: 50%;
}

.globo-detalhe {
position: absolute;
z-index: 8;
left: 22px;
bottom: 22px;
width: min(360px, calc(100% - 44px));
padding: 18px;
border-radius: 18px;
border: 1px solid rgba(80, 170, 255, 0.35);
background: rgba(2, 10, 30, 0.92);
backdrop-filter: blur(14px);
color: white;
box-shadow:
0 0 35px rgba(0, 80, 255, 0.16);
}

.globo-detalhe h3 {
margin: 0 0 8px;
font-size: 18px;
}

.globo-detalhe p {
margin: 5px 0;
color: #abc4df;
font-size: 12px;
line-height: 1.4;
}

.globo-fechar {
position: absolute;
top: 9px;
right: 11px;
border: 0;
background: transparent;
color: #9fb9d5;
font-size: 18px;
cursor: pointer;
}

@media (max-width: 720px) {
.globo-container {
height: 480px;
border-radius: 18px;
}

.globo-titulo {
top: 16px;
left: 16px;
}

.globo-contador {
top: 16px;
right: 16px;
}

.globo-legenda {
right: 14px;
bottom: 14px;
max-width: 230px;
}

.globo-detalhe {
left: 14px;
bottom: 14px;
width: calc(100% - 28px);
}
}
`}</style>

<div className="globo-titulo">
<span>
NEUROTWIN GEOINTELLIGENCE
</span>

<strong>
Globo Operacional 3D
</strong>
</div>

<div className="globo-contador">
{eventos.length} eventos geolocalizados
</div>

<Globe
ref={globeRef}
height={620}
backgroundColor="rgba(0,0,0,0)"
globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
showAtmosphere={true}
atmosphereColor="#1687ff"
atmosphereAltitude={0.18}
pointsData={eventos}
pointLat={(d: any) => d.lat}
pointLng={(d: any) => d.lng}
pointAltitude={(d: any) =>
0.012 +
Math.min(
Number(d.severidade || 1),
8
) *
0.008
}
pointRadius={(d: any) =>
0.22 +
Math.min(
Number(d.severidade || 1),
8
) *
0.06
}
pointColor={(d: any) =>
corEvento(
d as EventoGlobo
)
}
pointLabel={(d: any) => `
<div style="padding:8px;max-width:240px">
<strong>${String(
d.titulo
)}</strong><br/>
<span>${String(
d.tipo
)}</span><br/>
<span>Fonte: ${String(
d.fonte
)}</span>
</div>
`}
onPointClick={(d: any) =>
selecionar(
d as EventoGlobo
)
}
/>

{!selecionado && (
<div className="globo-legenda">
<div className="globo-legenda-item">
<span
className="globo-dot"
style={{
background: "#ffd43b",
}}
/>
Terremotos
</div>

<div className="globo-legenda-item">
<span
className="globo-dot"
style={{
background: "#00d4ff",
}}
/>
NASA EONET
</div>

<div className="globo-legenda-item">
<span
className="globo-dot"
style={{
background: "#22c55e",
}}
/>
GDACS
</div>
</div>
)}

{selecionado && (
<div className="globo-detalhe">
<button
className="globo-fechar"
onClick={() =>
setSelecionado(null)
}
>
×
</button>

<h3>
{selecionado.titulo}
</h3>

<p>
Evento:{" "}
{selecionado.tipo}
</p>

{selecionado.local && (
<p>
Local:{" "}
{selecionado.local}
</p>
)}

{selecionado.pais && (
<p>
País:{" "}
{selecionado.pais}
</p>
)}

{selecionado.magnitude !==
undefined && (
<p>
Magnitude:{" "}
{selecionado.magnitude.toFixed(
1
)}
</p>
)}

<p>
Coordenadas:{" "}
{selecionado.lat.toFixed(4)},{" "}
{selecionado.lng.toFixed(4)}
</p>

<p>
Fonte:{" "}
{selecionado.fonte}
</p>
</div>
)}
</div>
);
}