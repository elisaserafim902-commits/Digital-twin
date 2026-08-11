"use client";

import { useEffect, useMemo, useState } from "react";
import GloboOperacional from "@/components/observatorio/GloboOperacional";

type Fonte = {
status?: string;
descricao?: string;
atualizadoEm?: string;
};

type Terremoto = {
id?: string;
magnitude?: number;
local?: string;
horario?: number;
url?: string;
coordenadas?: number[];
};

type EventoNatural = {
id?: string;
titulo?: string;
descricao?: string | null;
categorias?: string[];
geometria?: any;
fontes?: any[];
};

type EventoGDACS = {
id?: string;
episodeId?: string;
tipo?: string;
nome?: string;
nivelAlerta?: string;
pontuacaoAlerta?: number;
pais?: string;
inicio?: string;
fim?: string;
coordenadas?: number[];
fonte?: string;
};

type DadosObservatorio = {
status?: string;
atualizadoEm?: string;

fontes?: {
usgs?: Fonte;
nasaEonet?: Fonte;
gdacs?: Fonte;
};

terremotos?: Terremoto[];
eventosNaturais?: EventoNatural[];
eventosGDACS?: EventoGDACS[];

resumo?: {
terremotos24h?: number;
terremotosFortes24h?: number;
eventosNaturaisAbertos?: number;
eventosGDACS?: number;
};
};

export default function ObservatorioGlobal() {
const [dados, setDados] =
useState<DadosObservatorio | null>(null);

const [carregando, setCarregando] =
useState(true);

const [erro, setErro] =
useState<string | null>(null);

async function carregar() {
try {
setCarregando(true);
setErro(null);

const resposta = await fetch(
"/api/observatorio",
{
cache: "no-store",
}
);

if (!resposta.ok) {
throw new Error(
`Falha HTTP ${resposta.status}`
);
}

const json =
(await resposta.json()) as DadosObservatorio;

setDados(json);
} catch (error) {
console.error(
"Erro Observatório:",
error
);

setErro(
error instanceof Error
? error.message
: "Falha ao carregar dados."
);
} finally {
setCarregando(false);
}
}

useEffect(() => {
carregar();

const timer = window.setInterval(
carregar,
60000
);

return () => {
window.clearInterval(timer);
};
}, []);

const fontesOnline = useMemo(() => {
const fontes = [
dados?.fontes?.usgs?.status,
dados?.fontes?.nasaEonet?.status,
dados?.fontes?.gdacs?.status,
];

return fontes.filter(
(status) =>
String(status).toLowerCase() ===
"online"
).length;
}, [dados]);

const gdacsPrioritarios =
useMemo(() => {
return [
...(dados?.eventosGDACS || []),
]
.sort((a, b) => {
const prioridade = (
nivel?: string
) => {
const valor = String(
nivel || ""
).toLowerCase();

if (valor === "red") return 3;
if (valor === "orange")
return 2;
if (valor === "green")
return 1;

return 0;
};

return (
prioridade(b.nivelAlerta) -
prioridade(a.nivelAlerta)
);
})
.slice(0, 6);
}, [dados]);

const terremotosPrioritarios =
useMemo(() => {
return [...(dados?.terremotos || [])]
.filter(
(item) =>
Number(item.magnitude || 0) >=
4.5
)
.sort(
(a, b) =>
Number(b.magnitude || 0) -
Number(a.magnitude || 0)
)
.slice(0, 6);
}, [dados]);

function dataFormatada(
valor?: string | number
) {
if (!valor) {
return "Não informado";
}

const data = new Date(valor);

if (Number.isNaN(data.getTime())) {
return String(valor);
}

return data.toLocaleString("pt-BR");
}

return (
<main className="nt-page">
<style>{`
* {
box-sizing: border-box;
}

html,
body {
margin: 0;
padding: 0;
overflow-x: hidden;
background: #01030a;
}

.nt-page {
min-height: 100vh;
width: 100%;
padding: 28px;
color: #fff;
font-family:
Arial,
Helvetica,
sans-serif;
background:
radial-gradient(
circle at 28% 20%,
rgba(0, 90, 220, 0.34),
transparent 36%
),
linear-gradient(
135deg,
#020817 0%,
#01030a 55%,
#000 100%
);
}

.header {
display: flex;
justify-content: space-between;
align-items: flex-end;
gap: 20px;
margin-bottom: 24px;
}

.eyebrow {
color: #4da8ff;
font-size: 12px;
font-weight: 800;
letter-spacing: 1.6px;
}

h1 {
margin: 6px 0;
font-size: clamp(
32px,
4vw,
52px
);
line-height: 1;
}

.subtitle {
max-width: 850px;
margin: 10px 0 0;
color: #91acd0;
line-height: 1.5;
}

.refresh {
min-width: 150px;
padding: 13px 18px;
border-radius: 12px;
border:
1px solid rgba(
65,
165,
255,
0.5
);
background:
linear-gradient(
135deg,
#0754c7,
#043782
);
color: white;
font-weight: 800;
cursor: pointer;
}

.refresh:disabled {
opacity: 0.65;
}

.metrics {
display: grid;
grid-template-columns:
repeat(
6,
minmax(0, 1fr)
);
gap: 12px;
margin-bottom: 18px;
}

.metric {
min-width: 0;
padding: 17px;
border-radius: 15px;
border:
1px solid rgba(
75,
150,
255,
0.27
);
background:
linear-gradient(
145deg,
rgba(5, 26, 65, 0.9),
rgba(2, 9, 28, 0.88)
);
box-shadow:
inset 0 0 22px
rgba(
0,
110,
255,
0.08
);
}

.metric span {
display: block;
color: #7ea8db;
font-size: 12px;
line-height: 1.3;
}

.metric strong {
display: block;
margin-top: 7px;
font-size: 24px;
overflow-wrap: anywhere;
}

.globe-section {
margin-bottom: 18px;
}

.intel-grid {
display: grid;
grid-template-columns:
repeat(
2,
minmax(0, 1fr)
);
gap: 18px;
}

.panel {
min-width: 0;
padding: 20px;
border-radius: 20px;
border:
1px solid rgba(
75,
150,
255,
0.26
);
background:
rgba(3, 13, 35, 0.86);
box-shadow:
inset 0 0 35px
rgba(
0,
100,
255,
0.06
);
}

.panel-title {
display: flex;
justify-content:
space-between;
align-items: center;
gap: 12px;
margin-bottom: 15px;
}

.panel-title h2 {
margin: 0;
font-size: 21px;
}

.panel-title span {
color: #5ba8ff;
font-size: 11px;
}

.event {
padding: 14px;
margin-bottom: 10px;
border-radius: 13px;
border:
1px solid rgba(
90,
160,
245,
0.2
);
background:
rgba(2, 8, 24, 0.75);
}

.event:last-child {
margin-bottom: 0;
}

.event-top {
display: flex;
justify-content:
space-between;
gap: 10px;
align-items: flex-start;
}

.event strong {
line-height: 1.3;
overflow-wrap: anywhere;
}

.event p {
margin: 5px 0;
color: #9eb5d2;
font-size: 12px;
line-height: 1.4;
overflow-wrap: anywhere;
}

.badge {
flex-shrink: 0;
padding: 5px 8px;
border-radius: 999px;
border:
1px solid rgba(
70,
170,
255,
0.45
);
color: #bce4ff;
font-size: 9px;
}

.sources {
display: grid;
grid-template-columns:
repeat(
3,
minmax(0, 1fr)
);
gap: 12px;
margin-top: 18px;
}

.source {
padding: 15px;
border-radius: 14px;
border:
1px solid rgba(
80,
155,
240,
0.2
);
background:
rgba(2, 8, 24, 0.72);
}

.source-top {
display: flex;
justify-content:
space-between;
align-items: center;
gap: 10px;
}

.source p {
color: #8fa8c8;
font-size: 11px;
line-height: 1.4;
margin-bottom: 0;
}

.status-online {
padding: 5px 8px;
border-radius: 999px;
border:
1px solid rgba(
52,
211,
153,
0.42
);
background:
rgba(
6,
78,
59,
0.24
);
color: #a7f3d0;
font-size: 9px;
}

.error {
margin-bottom: 18px;
padding: 14px;
border-radius: 12px;
border:
1px solid rgba(
255,
90,
90,
0.4
);
background:
rgba(
110,
20,
20,
0.25
);
color: #fecaca;
}

@media (
max-width: 1100px
) {
.metrics {
grid-template-columns:
repeat(
3,
minmax(0, 1fr)
);
}
}

@media (
max-width: 760px
) {
.nt-page {
padding: 14px;
}

.header {
flex-direction: column;
align-items: stretch;
}

.refresh {
width: 100%;
}

.metrics {
grid-template-columns:
repeat(
2,
minmax(0, 1fr)
);
}

.intel-grid {
grid-template-columns:
1fr;
}

.sources {
grid-template-columns:
1fr;
}
}

@media (
max-width: 420px
) {
.metrics {
grid-template-columns:
1fr;
}
}
`}</style>

<header className="header">
<div>
<div className="eyebrow">
NEUROTWIN 2050 · GLOBAL
INTELLIGENCE
</div>

<h1>
Observatório Global
</h1>

<p className="subtitle">
Inteligência geoespacial para
monitoramento de terremotos,
desastres e eventos ambientais
mundiais.
</p>
</div>

<button
type="button"
className="refresh"
onClick={carregar}
disabled={carregando}
>
{carregando
? "Atualizando..."
: "Atualizar agora"}
</button>
</header>

{erro && (
<div className="error">
{erro}
</div>
)}

<section className="metrics">
<Metric
titulo="Status Global"
valor={
carregando
? "..."
: dados?.status ||
"offline"
}
/>

<Metric
titulo="Fontes Online"
valor={`${fontesOnline}/3`}
/>

<Metric
titulo="Terremotos 24h"
valor={
dados?.resumo
?.terremotos24h ?? 0
}
/>

<Metric
titulo="Terremotos ≥ 4.5"
valor={
dados?.resumo
?.terremotosFortes24h ??
0
}
/>

<Metric
titulo="Eventos NASA"
valor={
dados?.resumo
?.eventosNaturaisAbertos ??
0
}
/>

<Metric
titulo="Eventos GDACS"
valor={
dados?.resumo
?.eventosGDACS ?? 0
}
/>
</section>

<section className="globe-section">
<GloboOperacional
terremotos={
dados?.terremotos || []
}
eventosNaturais={
dados?.eventosNaturais || []
}
eventosGDACS={
dados?.eventosGDACS || []
}
/>
</section>

<section className="intel-grid">
<article className="panel">
<div className="panel-title">
<h2>
Alertas GDACS
Prioritários
</h2>

<span>
DESASTRES GLOBAIS
</span>
</div>

{gdacsPrioritarios.length ===
0 ? (
<p>
{carregando
? "Carregando alertas..."
: "Nenhum alerta disponível."}
</p>
) : (
gdacsPrioritarios.map(
(evento, index) => (
<div
className="event"
key={
evento.id ||
`gdacs-${index}`
}
>
<div className="event-top">
<strong>
{String(
evento.nome ||
"Evento GDACS"
)}
</strong>

<span className="badge">
{String(
evento.nivelAlerta ||
"N/A"
)}
</span>
</div>

<p>
Tipo:{" "}
{String(
evento.tipo ||
"Não informado"
)}
</p>

<p>
País:{" "}
{String(
evento.pais ||
"Não informado"
)}
</p>

<p>
Início:{" "}
{dataFormatada(
evento.inicio
)}
</p>

<p>Fonte: GDACS</p>
</div>
)
)
)}
</article>

<article className="panel">
<div className="panel-title">
<h2>
Atividade Sísmica
Prioritária
</h2>

<span>
USGS LIVE FEED
</span>
</div>

{terremotosPrioritarios
.length === 0 ? (
<p>
{carregando
? "Carregando terremotos..."
: "Nenhum terremoto prioritário."}
</p>
) : (
terremotosPrioritarios.map(
(evento, index) => (
<div
className="event"
key={
evento.id ||
`usgs-${index}`
}
>
<div className="event-top">
<strong>
M{" "}
{Number(
evento.magnitude ||
0
).toFixed(1)}
</strong>

<span className="badge">
USGS
</span>
</div>

<p>
Local:{" "}
{String(
evento.local ||
"Não informado"
)}
</p>

<p>
Horário:{" "}
{dataFormatada(
evento.horario
)}
</p>

<p>
Fonte: USGS
</p>
</div>
)
)
)}
</article>
</section>

<section className="sources">
<SourceCard
nome="USGS"
fonte={dados?.fontes?.usgs}
/>

<SourceCard
nome="NASA EONET"
fonte={
dados?.fontes?.nasaEonet
}
/>

<SourceCard
nome="GDACS"
fonte={dados?.fontes?.gdacs}
/>
</section>
</main>
);
}

function Metric({
titulo,
valor,
}: {
titulo: string;
valor: string | number;
}) {
return (
<div className="metric">
<span>{titulo}</span>
<strong>
{String(valor)}
</strong>
</div>
);
}

function SourceCard({
nome,
fonte,
}: {
nome: string;
fonte?: Fonte;
}) {
return (
<div className="source">
<div className="source-top">
<strong>{nome}</strong>

<span className="status-online">
{String(
fonte?.status ||
"offline"
)}
</span>
</div>

<p>
{String(
fonte?.descricao ||
"Fonte integrada"
)}
</p>
</div>
);
}