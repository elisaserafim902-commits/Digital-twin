"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Alerta = {
id: string;
titulo: string;
tipo: string;
local: string;
fonte: "USGS" | "GDACS" | "NASA EONET";
nivel: "CRÍTICO" | "ALTO" | "ATENÇÃO";
severidade: number;
data: string | number | null;
magnitude?: number;
coordenadas?: number[] | null;
detalhe?: string;
};

function formatarData(valor: string | number | null) {
if (!valor) return "Horário não informado";

try {
const data =
typeof valor === "number"
? new Date(valor)
: new Date(valor);

if (Number.isNaN(data.getTime())) {
return "Horário não informado";
}

return data.toLocaleString("pt-BR");
} catch {
return "Horário não informado";
}
}

function nivelPorSeveridade(
severidade: number
): "CRÍTICO" | "ALTO" | "ATENÇÃO" {
if (severidade >= 9) return "CRÍTICO";
if (severidade >= 6) return "ALTO";
return "ATENÇÃO";
}

function corNivel(nivel: Alerta["nivel"]) {
if (nivel === "CRÍTICO") return "#ff365f";
if (nivel === "ALTO") return "#ff9d2e";
return "#ffd84d";
}

function normalizarTexto(valor: unknown) {
return String(valor ?? "").toLowerCase();
}

export default function AlertasCriticosPage() {
const [dados, setDados] = useState<any>(null);
const [carregando, setCarregando] = useState(true);
const [erro, setErro] = useState("");
const [filtro, setFiltro] = useState<
"TODOS" | "CRÍTICO" | "ALTO" | "ATENÇÃO"
>("TODOS");

const carregar = useCallback(async () => {
setCarregando(true);
setErro("");

try {
const resposta = await fetch("/api/observatorio", {
cache: "no-store",
});

if (!resposta.ok) {
throw new Error(`HTTP ${resposta.status}`);
}

const json = await resposta.json();
setDados(json);
} catch (error) {
console.error(error);
setErro("Não foi possível atualizar os alertas neste momento.");
} finally {
setCarregando(false);
}
}, []);

useEffect(() => {
carregar();

const intervalo = window.setInterval(() => {
carregar();
}, 120000);

return () => window.clearInterval(intervalo);
}, [carregar]);

const alertas = useMemo<Alerta[]>(() => {
if (!dados) return [];

const lista: Alerta[] = [];

/*
* USGS
*/
const terremotos = Array.isArray(dados?.terremotos)
? dados.terremotos
: [];

terremotos.forEach((item: any, indice: number) => {
const magnitude = Number(item?.magnitude ?? 0);
const tsunami = item?.tsunami === true;

let severidade = 0;

if (tsunami) severidade = 10;
else if (magnitude >= 7) severidade = 10;
else if (magnitude >= 6) severidade = 9;
else if (magnitude >= 5) severidade = 7;
else if (magnitude >= 4.5) severidade = 5;

if (severidade < 5) return;

lista.push({
id: `usgs-${item?.id ?? indice}`,
titulo: tsunami
? `Risco sísmico com indicação de tsunami · M ${magnitude.toFixed(1)}`
: `Terremoto M ${magnitude.toFixed(1)}`,
tipo: tsunami ? "Terremoto / Tsunami" : "Terremoto",
local: item?.local || "Local não informado",
fonte: "USGS",
severidade,
nivel: nivelPorSeveridade(severidade),
data: item?.horario ?? null,
magnitude,
coordenadas: Array.isArray(item?.coordenadas)
? item.coordenadas
: null,
detalhe: tsunami
? "Evento sísmico com sinalização de tsunami na fonte."
: "Atividade sísmica monitorada pelo USGS.",
});
});

/*
* GDACS
*/
const gdacs = Array.isArray(dados?.eventosGDACS)
? dados.eventosGDACS
: [];

gdacs.forEach((item: any, indice: number) => {
const alerta = normalizarTexto(
item?.alerta ??
item?.alertlevel ??
item?.alertLevel ??
item?.nivel
);

let severidade = 5;

if (alerta.includes("red") || alerta.includes("vermelho")) {
severidade = 10;
} else if (
alerta.includes("orange") ||
alerta.includes("laranja")
) {
severidade = 8;
} else if (
alerta.includes("green") ||
alerta.includes("verde")
) {
severidade = 5;
}

lista.push({
id: `gdacs-${item?.id ?? indice}`,
titulo:
item?.titulo ||
item?.title ||
item?.nome ||
"Evento GDACS",
tipo:
item?.tipo ||
item?.eventtype ||
item?.eventType ||
"Desastre global",
local:
item?.pais ||
item?.country ||
item?.local ||
"Local não informado",
fonte: "GDACS",
severidade,
nivel: nivelPorSeveridade(severidade),
data:
item?.inicio ||
item?.data ||
item?.date ||
item?.horario ||
null,
coordenadas: Array.isArray(item?.coordenadas)
? item.coordenadas
: null,
detalhe:
item?.descricao ||
item?.description ||
"Evento monitorado pelo Global Disaster Alert and Coordination System.",
});
});

/*
* NASA EONET
*/
const nasa = Array.isArray(dados?.eventosNaturais)
? dados.eventosNaturais
: [];

nasa.forEach((item: any, indice: number) => {
const categorias = Array.isArray(item?.categorias)
? item.categorias.join(" ")
: "";

const texto = normalizarTexto(
`${item?.titulo ?? ""} ${categorias}`
);

let severidade = 0;

if (
texto.includes("volcano") ||
texto.includes("vulc") ||
texto.includes("cyclone") ||
texto.includes("ciclone") ||
texto.includes("hurricane") ||
texto.includes("typhoon")
) {
severidade = 7;
} else if (
texto.includes("wildfire") ||
texto.includes("fire") ||
texto.includes("incênd") ||
texto.includes("flood") ||
texto.includes("enchente")
) {
severidade = 5;
}

if (severidade < 5) return;

lista.push({
id: `nasa-${item?.id ?? indice}`,
titulo: item?.titulo || "Evento natural",
tipo:
Array.isArray(item?.categorias) &&
item.categorias.length > 0
? item.categorias.join(", ")
: "Evento natural",
local: "Monitoramento geoespacial",
fonte: "NASA EONET",
severidade,
nivel: nivelPorSeveridade(severidade),
data: item?.data ?? null,
coordenadas: Array.isArray(item?.coordenadas)
? item.coordenadas
: null,
detalhe:
item?.descricao ||
"Evento natural aberto monitorado pela NASA EONET.",
});
});

return lista.sort((a, b) => {
if (b.severidade !== a.severidade) {
return b.severidade - a.severidade;
}

const dataA = a.data ? new Date(a.data).getTime() : 0;
const dataB = b.data ? new Date(b.data).getTime() : 0;

return dataB - dataA;
});
}, [dados]);

const alertasFiltrados = useMemo(() => {
if (filtro === "TODOS") return alertas;
return alertas.filter((item) => item.nivel === filtro);
}, [alertas, filtro]);

const criticos = alertas.filter(
(item) => item.nivel === "CRÍTICO"
).length;

const altos = alertas.filter(
(item) => item.nivel === "ALTO"
).length;

const atencao = alertas.filter(
(item) => item.nivel === "ATENÇÃO"
).length;

const fontesOnline = [
dados?.fontes?.usgs?.status,
dados?.fontes?.nasaEonet?.status,
dados?.fontes?.gdacs?.status,
].filter((status) => status === "online").length;

return (
<main className="page">
<div className="ambient ambient1" />
<div className="ambient ambient2" />

<div className="container">
<header className="header">
<div>
<div className="eyebrow">
NEUROTWIN 2050 · INTELLIGENCE CENTER
</div>

<h1>Alertas Críticos</h1>

<p>
Central inteligente de priorização de riscos sísmicos,
ambientais e desastres globais.
</p>
</div>

<div className="headerActions">
<Link
href="/dashboard/observatorio"
className="button secondary"
>
← Observatório
</Link>

<button
className="button primary"
onClick={carregar}
disabled={carregando}
>
{carregando ? "Atualizando..." : "Atualizar agora"}
</button>
</div>
</header>

<section className="cards">
<Card
titulo="Status Global"
valor={erro ? "degradado" : "online"}
destaque
/>

<Card
titulo="Fontes Online"
valor={`${fontesOnline}/3`}
/>

<Card
titulo="Alertas Críticos"
valor={String(criticos)}
cor="#ff365f"
/>

<Card
titulo="Alta Prioridade"
valor={String(altos)}
cor="#ff9d2e"
/>

<Card
titulo="Em Atenção"
valor={String(atencao)}
cor="#ffd84d"
/>

<Card
titulo="Total Analisado"
valor={String(alertas.length)}
/>
</section>

{erro && (
<div className="error">
<strong>Conexão degradada.</strong> {erro}
</div>
)}

<section className="command">
<div>
<span className="liveDot" />
MOTOR DE PRIORIZAÇÃO ATIVO
</div>

<span>
USGS · NASA EONET · GDACS
</span>
</section>

<section className="filters">
{(["TODOS", "CRÍTICO", "ALTO", "ATENÇÃO"] as const).map(
(item) => (
<button
key={item}
onClick={() => setFiltro(item)}
className={
filtro === item
? "filter active"
: "filter"
}
>
{item}
</button>
)
)}
</section>

<section className="content">
<div className="alertsPanel">
<div className="sectionTitle">
<div>
<span>NEUROTWIN RISK ENGINE</span>
<h2>Fila de Prioridade Global</h2>
</div>

<div className="counter">
{alertasFiltrados.length} eventos
</div>
</div>

{carregando && !dados ? (
<div className="empty">
Analisando os feeds globais...
</div>
) : alertasFiltrados.length === 0 ? (
<div className="empty">
Nenhum evento encontrado para este nível.
</div>
) : (
<div className="alerts">
{alertasFiltrados.map((alerta, indice) => (
<article
className="alert"
key={alerta.id}
>
<div
className="severityLine"
style={{
background: corNivel(alerta.nivel),
}}
/>

<div className="alertTop">
<div className="rank">
#{String(indice + 1).padStart(2, "0")}
</div>

<div
className="level"
style={{
color: corNivel(alerta.nivel),
borderColor: `${corNivel(
alerta.nivel
)}80`,
background: `${corNivel(
alerta.nivel
)}12`,
}}
>
{alerta.nivel}
</div>
</div>

<h3>{alerta.titulo}</h3>

<div className="type">
{alerta.tipo}
</div>

<div className="grid">
<Info
titulo="Local"
valor={alerta.local}
/>

<Info
titulo="Fonte"
valor={alerta.fonte}
/>

<Info
titulo="Horário"
valor={formatarData(alerta.data)}
/>

<Info
titulo="Severidade"
valor={`${alerta.severidade}/10`}
/>
</div>

{alerta.coordenadas &&
alerta.coordenadas.length >= 2 && (
<div className="coordinates">
Coordenadas:{" "}
{Number(
alerta.coordenadas[0]
).toFixed(4)}
,{" "}
{Number(
alerta.coordenadas[1]
).toFixed(4)}
</div>
)}

{alerta.detalhe && (
<p className="detail">
{alerta.detalhe}
</p>
)}
</article>
))}
</div>
)}
</div>

<aside className="intelligence">
<div className="radar">
<div className="radarCircle circle1" />
<div className="radarCircle circle2" />
<div className="radarCircle circle3" />
<div className="radarLine horizontal" />
<div className="radarLine vertical" />
<div className="sweep" />
<div className="centerPoint" />
</div>

<div className="intelTitle">
NEUROTWIN
<strong>Risk Intelligence</strong>
</div>

<div className="intelBlock">
<span>Prioridade máxima</span>
<strong>{criticos}</strong>
</div>

<div className="intelBlock">
<span>Alta prioridade</span>
<strong>{altos}</strong>
</div>

<div className="intelBlock">
<span>Monitoramento</span>
<strong>
{fontesOnline === 3
? "OPERACIONAL"
: "DEGRADADO"}
</strong>
</div>

<div className="intelNote">
A classificação desta tela é uma priorização
operacional do NeuroTwin baseada nos dados recebidos
das fontes. Ela não substitui alertas oficiais de
autoridades locais.
</div>
</aside>
</section>
</div>

<style jsx>{`
* {
box-sizing: border-box;
}

.page {
min-height: 100vh;
background:
radial-gradient(
circle at 50% 15%,
rgba(0, 119, 255, 0.18),
transparent 32%
),
linear-gradient(
145deg,
#07111f 0%,
#09182b 45%,
#06101d 100%
);
color: #f4f8ff;
font-family:
Inter,
system-ui,
-apple-system,
BlinkMacSystemFont,
"Segoe UI",
sans-serif;
position: relative;
overflow: hidden;
}

.ambient {
position: fixed;
width: 500px;
height: 500px;
border-radius: 50%;
filter: blur(120px);
pointer-events: none;
opacity: 0.16;
}

.ambient1 {
background: #006eff;
top: -180px;
left: 25%;
}

.ambient2 {
background: #00b7ff;
right: -260px;
bottom: -180px;
}

.container {
width: min(1500px, calc(100% - 40px));
margin: 0 auto;
padding: 38px 0 70px;
position: relative;
z-index: 2;
}

.header {
display: flex;
justify-content: space-between;
align-items: flex-start;
gap: 30px;
margin-bottom: 28px;
}

.eyebrow {
color: #32a8ff;
font-size: 12px;
font-weight: 800;
letter-spacing: 0.16em;
margin-bottom: 7px;
}

h1 {
margin: 0;
font-size: clamp(34px, 4vw, 58px);
line-height: 1;
letter-spacing: -0.04em;
}

.header p {
color: #8ecfff;
margin: 12px 0 0;
font-size: 15px;
}

.headerActions {
display: flex;
gap: 10px;
flex-wrap: wrap;
}

.button {
min-height: 44px;
padding: 0 18px;
border-radius: 12px;
border: 1px solid #1678ff;
font-weight: 800;
cursor: pointer;
text-decoration: none;
display: inline-flex;
align-items: center;
justify-content: center;
font-size: 13px;
}

.primary {
background: linear-gradient(
135deg,
#006cff,
#009dff
);
color: white;
box-shadow: 0 0 30px rgba(0, 111, 255, 0.2);
}

.secondary {
color: #9dd6ff;
background: rgba(11, 35, 62, 0.75);
}

.cards {
display: grid;
grid-template-columns: repeat(6, 1fr);
gap: 10px;
margin-bottom: 14px;
}

.command {
border: 1px solid rgba(45, 135, 255, 0.35);
background: rgba(10, 29, 51, 0.7);
border-radius: 14px;
padding: 13px 16px;
display: flex;
justify-content: space-between;
gap: 20px;
color: #86cfff;
font-size: 11px;
font-weight: 800;
letter-spacing: 0.08em;
margin-bottom: 14px;
}

.liveDot {
display: inline-block;
width: 7px;
height: 7px;
background: #31e98d;
border-radius: 50%;
margin-right: 8px;
box-shadow: 0 0 13px #31e98d;
}

.error {
border: 1px solid rgba(255, 54, 95, 0.5);
background: rgba(255, 54, 95, 0.08);
color: #ffb6c5;
border-radius: 12px;
padding: 12px 15px;
margin-bottom: 14px;
}

.filters {
display: flex;
gap: 8px;
flex-wrap: wrap;
margin-bottom: 16px;
}

.filter {
border: 1px solid rgba(42, 126, 255, 0.35);
background: rgba(10, 30, 53, 0.72);
color: #8ebfe9;
border-radius: 999px;
padding: 9px 15px;
cursor: pointer;
font-size: 11px;
font-weight: 900;
letter-spacing: 0.05em;
}

.filter.active {
background: #0878ff;
border-color: #37a5ff;
color: white;
box-shadow: 0 0 20px rgba(0, 117, 255, 0.22);
}

.content {
display: grid;
grid-template-columns: minmax(0, 1fr) 310px;
gap: 16px;
}

.alertsPanel,
.intelligence {
border: 1px solid rgba(47, 132, 255, 0.28);
background: rgba(7, 23, 42, 0.76);
border-radius: 20px;
backdrop-filter: blur(15px);
}

.alertsPanel {
padding: 20px;
}

.sectionTitle {
display: flex;
justify-content: space-between;
align-items: flex-end;
margin-bottom: 15px;
gap: 15px;
}

.sectionTitle span {
color: #249cff;
font-size: 10px;
font-weight: 900;
letter-spacing: 0.14em;
}

.sectionTitle h2 {
margin: 5px 0 0;
font-size: 25px;
}

.counter {
color: #83caff;
border: 1px solid rgba(46, 143, 255, 0.4);
border-radius: 999px;
padding: 7px 12px;
font-size: 11px;
white-space: nowrap;
}

.alerts {
display: grid;
grid-template-columns: repeat(2, minmax(0, 1fr));
gap: 12px;
}

.alert {
position: relative;
overflow: hidden;
border: 1px solid rgba(48, 132, 255, 0.26);
background:
linear-gradient(
135deg,
rgba(14, 43, 76, 0.88),
rgba(7, 25, 45, 0.94)
);
border-radius: 16px;
padding: 17px 17px 16px 20px;
min-width: 0;
}

.alert:hover {
border-color: rgba(58, 156, 255, 0.62);
transform: translateY(-1px);
}

.severityLine {
position: absolute;
top: 0;
bottom: 0;
left: 0;
width: 4px;
}

.alertTop {
display: flex;
justify-content: space-between;
align-items: center;
gap: 10px;
}

.rank {
color: #559bd4;
font-size: 11px;
font-weight: 900;
}

.level {
border: 1px solid;
border-radius: 999px;
padding: 4px 8px;
font-size: 9px;
font-weight: 950;
letter-spacing: 0.08em;
}

.alert h3 {
margin: 12px 0 5px;
font-size: 18px;
line-height: 1.2;
}

.type {
color: #4eaaff;
font-size: 11px;
font-weight: 800;
margin-bottom: 15px;
}

.grid {
display: grid;
grid-template-columns: 1fr 1fr;
gap: 11px;
}

.coordinates {
margin-top: 12px;
color: #77bde9;
font-size: 10px;
font-family: monospace;
}

.detail {
margin: 11px 0 0;
color: #9dbbd3;
font-size: 11px;
line-height: 1.5;
}

.empty {
padding: 80px 20px;
text-align: center;
color: #7ca7c9;
}

.intelligence {
padding: 20px;
height: fit-content;
position: sticky;
top: 20px;
}

.radar {
width: 210px;
height: 210px;
border-radius: 50%;
margin: 5px auto 18px;
position: relative;
overflow: hidden;
border: 1px solid rgba(36, 154, 255, 0.5);
background:
radial-gradient(
circle,
rgba(0, 166, 255, 0.18),
rgba(0, 79, 146, 0.04) 55%,
rgba(0, 0, 0, 0) 70%
);
box-shadow:
inset 0 0 50px rgba(0, 124, 255, 0.15),
0 0 40px rgba(0, 105, 255, 0.08);
}

.radarCircle {
position: absolute;
border: 1px solid rgba(51, 163, 255, 0.25);
border-radius: 50%;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
}

.circle1 {
width: 70px;
height: 70px;
}

.circle2 {
width: 135px;
height: 135px;
}

.circle3 {
width: 195px;
height: 195px;
}

.radarLine {
position: absolute;
background: rgba(56, 163, 255, 0.2);
}

.horizontal {
height: 1px;
width: 100%;
top: 50%;
}

.vertical {
width: 1px;
height: 100%;
left: 50%;
}

.sweep {
position: absolute;
width: 50%;
height: 50%;
top: 0;
left: 50%;
transform-origin: bottom left;
background: linear-gradient(
35deg,
rgba(0, 179, 255, 0.35),
transparent 70%
);
animation: radar 4s linear infinite;
}

@keyframes radar {
from {
transform: rotate(0deg);
}
to {
transform: rotate(360deg);
}
}

.centerPoint {
position: absolute;
width: 8px;
height: 8px;
background: #46d8ff;
border-radius: 50%;
top: calc(50% - 4px);
left: calc(50% - 4px);
box-shadow: 0 0 15px #46d8ff;
}

.intelTitle {
text-align: center;
color: #36a9ff;
font-size: 10px;
font-weight: 900;
letter-spacing: 0.1em;
margin-bottom: 18px;
}

.intelTitle strong {
display: block;
color: white;
font-size: 21px;
letter-spacing: -0.02em;
margin-top: 4px;
}

.intelBlock {
border-top: 1px solid rgba(53, 139, 230, 0.18);
padding: 13px 2px;
display: flex;
justify-content: space-between;
gap: 15px;
align-items: center;
}

.intelBlock span {
color: #7fa9ca;
font-size: 11px;
}

.intelBlock strong {
font-size: 12px;
color: #d9efff;
}

.intelNote {
margin-top: 13px;
border: 1px solid rgba(49, 137, 238, 0.2);
background: rgba(15, 45, 76, 0.55);
border-radius: 12px;
padding: 12px;
color: #779dbb;
font-size: 9px;
line-height: 1.55;
}

@media (max-width: 1100px) {
.cards {
grid-template-columns: repeat(3, 1fr);
}

.content {
grid-template-columns: 1fr;
}

.intelligence {
position: relative;
top: 0;
}
}

@media (max-width: 760px) {
.container {
width: min(100% - 22px, 1500px);
padding-top: 24px;
}

.header {
flex-direction: column;
}

.cards {
grid-template-columns: repeat(2, 1fr);
}

.alerts {
grid-template-columns: 1fr;
}

.command {
flex-direction: column;
}

.grid {
grid-template-columns: 1fr;
}
}
`}</style>
</main>
);
}

function Card({
titulo,
valor,
destaque = false,
cor,
}: {
titulo: string;
valor: string;
destaque?: boolean;
cor?: string;
}) {
return (
<div className="card">
<span>{titulo}</span>

<strong
style={{
color: cor || (destaque ? "#58d9ff" : "#ffffff"),
}}
>
{valor}
</strong>

<style jsx>{`
.card {
min-height: 82px;
padding: 14px;
border-radius: 15px;
border: 1px solid rgba(48, 132, 255, 0.32);
background:
linear-gradient(
145deg,
rgba(18, 45, 77, 0.85),
rgba(10, 29, 51, 0.75)
);
}

span {
display: block;
color: #68baff;
font-size: 10px;
margin-bottom: 8px;
}

strong {
font-size: 23px;
line-height: 1;
}
`}</style>
</div>
);
}

function Info({
titulo,
valor,
}: {
titulo: string;
valor: string;
}) {
return (
<div className="info">
<span>{titulo}</span>
<strong>{valor}</strong>

<style jsx>{`
.info {
min-width: 0;
}

span {
display: block;
color: #648eae;
font-size: 9px;
margin-bottom: 3px;
}

strong {
color: #cde9ff;
display: block;
font-size: 10px;
line-height: 1.35;
overflow-wrap: anywhere;
}
`}</style>
</div>
);
}