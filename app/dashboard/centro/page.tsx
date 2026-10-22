"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type EventoCognitivo = {
id: string;
titulo: string;
tipo: string;
fonte: "USGS" | "GDACS" | "NASA EONET";
severidade: number;
local: string;
data: string | number | null;
magnitude?: number;
};

function normalizar(valor: unknown) {
return String(valor ?? "").toLowerCase();
}

function formatarData(valor: string | number | null) {
if (!valor) return "Horário não informado";

try {
const data = new Date(valor);

if (Number.isNaN(data.getTime())) {
return "Horário não informado";
}

return data.toLocaleString("pt-BR");
} catch {
return "Horário não informado";
}
}

function corSeveridade(severidade: number) {
if (severidade >= 9) return "#ff3b62";
if (severidade >= 6) return "#ff9d2e";
return "#ffd84d";
}

function nivelSeveridade(severidade: number) {
if (severidade >= 9) return "CRÍTICO";
if (severidade >= 6) return "ALTO";
return "ATENÇÃO";
}

export default function CentroCognitivoPage() {
const [dados, setDados] = useState<any>(null);
const [carregando, setCarregando] = useState(true);
const [erro, setErro] = useState("");
const [ultimaAtualizacao, setUltimaAtualizacao] =
useState<Date | null>(null);

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
setUltimaAtualizacao(new Date());
} catch (error) {
console.error(error);
setErro(
"Não foi possível atualizar a inteligência operacional neste momento."
);
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

const eventos = useMemo<EventoCognitivo[]>(() => {
if (!dados) return [];

const lista: EventoCognitivo[] = [];

/*
* USGS
*/
const terremotos = Array.isArray(dados?.terremotos)
? dados.terremotos
: [];

terremotos.forEach((item: any, indice: number) => {
const magnitude = Number(item?.magnitude ?? 0);
const tsunami = item?.tsunami === true;

let severidade = 1;

if (tsunami) severidade = 10;
else if (magnitude >= 7) severidade = 10;
else if (magnitude >= 6) severidade = 9;
else if (magnitude >= 5) severidade = 7;
else if (magnitude >= 4.5) severidade = 5;
else if (magnitude >= 4) severidade = 4;
else severidade = 2;

lista.push({
id: `usgs-${item?.id ?? indice}`,
titulo: tsunami
? `Evento sísmico com indicação de tsunami · M ${magnitude.toFixed(
1
)}`
: `Terremoto M ${magnitude.toFixed(1)}`,
tipo: tsunami ? "Terremoto / Tsunami" : "Terremoto",
fonte: "USGS",
severidade,
local: item?.local || "Local não informado",
data: item?.horario ?? null,
magnitude,
});
});

/*
* GDACS
*/
const gdacs = Array.isArray(dados?.eventosGDACS)
? dados.eventosGDACS
: [];

gdacs.forEach((item: any, indice: number) => {
const alerta = normalizar(
item?.alerta ??
item?.alertlevel ??
item?.alertLevel ??
item?.nivel
);

let severidade = 4;

if (
alerta.includes("red") ||
alerta.includes("vermelho")
) {
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
fonte: "GDACS",
severidade,
local:
item?.pais ||
item?.country ||
item?.local ||
"Local não informado",
data:
item?.inicio ||
item?.data ||
item?.date ||
item?.horario ||
null,
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

const texto = normalizar(
`${item?.titulo ?? ""} ${categorias}`
);

let severidade = 3;

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

lista.push({
id: `nasa-${item?.id ?? indice}`,
titulo: item?.titulo || "Evento natural",
tipo:
Array.isArray(item?.categorias) &&
item.categorias.length > 0
? item.categorias.join(", ")
: "Evento natural",
fonte: "NASA EONET",
severidade,
local: "Monitoramento geoespacial",
data: item?.data ?? null,
});
});

return lista.sort((a, b) => {
if (b.severidade !== a.severidade) {
return b.severidade - a.severidade;
}

const dataA = a.data
? new Date(a.data).getTime()
: 0;

const dataB = b.data
? new Date(b.data).getTime()
: 0;

return dataB - dataA;
});
}, [dados]);

const analise = useMemo(() => {
const criticos = eventos.filter(
(evento) => evento.severidade >= 9
);

const altos = eventos.filter(
(evento) =>
evento.severidade >= 6 &&
evento.severidade < 9
);

const atencao = eventos.filter(
(evento) =>
evento.severidade >= 5 &&
evento.severidade < 6
);

const terremotos = eventos.filter(
(evento) => evento.fonte === "USGS"
);

const gdacs = eventos.filter(
(evento) => evento.fonte === "GDACS"
);

const nasa = eventos.filter(
(evento) => evento.fonte === "NASA EONET"
);

const maiorTerremoto = terremotos
.filter(
(evento) =>
typeof evento.magnitude === "number"
)
.sort(
(a, b) =>
Number(b.magnitude ?? 0) -
Number(a.magnitude ?? 0)
)[0];

const prioridade =
criticos[0] || altos[0] || atencao[0] || eventos[0];

let estado = "ESTÁVEL";

if (criticos.length > 0) {
estado = "PRIORIDADE MÁXIMA";
} else if (altos.length > 0) {
estado = "ATENÇÃO ELEVADA";
} else if (eventos.length > 0) {
estado = "MONITORAMENTO";
}

return {
criticos,
altos,
atencao,
terremotos,
gdacs,
nasa,
maiorTerremoto,
prioridade,
estado,
};
}, [eventos]);

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
NEUROTWIN 2050 · COGNITIVE CORE
</div>

<h1>Centro Cognitivo</h1>

<p>
Síntese operacional automática dos sinais
recebidos pelo ecossistema NeuroTwin.
</p>
</div>

<div className="actions">
<Link
href="/dashboard"
className="button secondary"
>
← Painel
</Link>

<Link
href="/dashboard/observatorio"
className="button secondary"
>
Observatório
</Link>

<Link
href="/dashboard/alertas"
className="button secondary"
>
Alertas
</Link>

<button
className="button primary"
onClick={carregar}
disabled={carregando}
>
{carregando
? "Processando..."
: "Atualizar inteligência"}
</button>
</div>
</header>

<section className="statusBar">
<div>
<span
className={
erro ? "statusDot errorDot" : "statusDot"
}
/>

{erro
? "INTELIGÊNCIA DEGRADADA"
: "NÚCLEO COGNITIVO OPERACIONAL"}
</div>

<span>
{ultimaAtualizacao
? `Última síntese: ${ultimaAtualizacao.toLocaleTimeString(
"pt-BR"
)}`
: "Inicializando síntese..."}
</span>
</section>

{erro && (
<div className="error">
<strong>Conexão degradada.</strong> {erro}
</div>
)}

<section className="metrics">
<Metric
titulo="Fontes"
valor={`${fontesOnline}/3`}
legenda="feeds operacionais"
/>

<Metric
titulo="Eventos"
valor={String(eventos.length)}
legenda="sinais processados"
/>

<Metric
titulo="Críticos"
valor={String(analise.criticos.length)}
legenda="prioridade máxima"
cor="#ff365f"
/>

<Metric
titulo="Alta prioridade"
valor={String(analise.altos.length)}
legenda="requer atenção"
cor="#ff9d2e"
/>

<Metric
titulo="Estado"
valor={analise.estado}
legenda="classificação operacional"
/>
</section>

<section className="workspace">
<div className="leftColumn">
<div className="panel">
<div className="panelHeader">
<div>
<span>COGNITIVE SYNTHESIS</span>
<h2>Síntese Global</h2>
</div>

<div className="processing">
<span className="pulse" />
LIVE
</div>
</div>

{carregando && !dados ? (
<div className="loading">
Integrando sinais globais...
</div>
) : (
<div className="synthesis">
<Insight
numero="01"
titulo="Estado operacional"
texto={
analise.criticos.length > 0
? `${analise.criticos.length} evento(s) atingiram o nível crítico definido pelo motor operacional.`
: analise.altos.length > 0
? `${analise.altos.length} evento(s) encontram-se classificados em alta prioridade.`
: "Nenhum evento atingiu nível crítico ou alto na classificação atual."
}
/>

<Insight
numero="02"
titulo="Atividade sísmica"
texto={
analise.maiorTerremoto
? `O maior terremoto presente no conjunto atual possui magnitude ${Number(
analise.maiorTerremoto.magnitude
).toFixed(1)} e está associado a ${analise.maiorTerremoto.local}.`
: "Nenhum terremoto foi identificado no conjunto atual."
}
/>

<Insight
numero="03"
titulo="Desastres globais"
texto={`${analise.gdacs.length} evento(s) do GDACS estão sendo considerados pela síntese operacional.`}
/>

<Insight
numero="04"
titulo="Eventos ambientais"
texto={`${analise.nasa.length} evento(s) provenientes da NASA EONET estão integrados ao núcleo cognitivo.`}
/>
</div>
)}
</div>

<div className="panel">
<div className="panelHeader">
<div>
<span>PRIORITY ENGINE</span>
<h2>Eventos de Maior Relevância</h2>
</div>
</div>

<div className="priorityList">
{eventos.slice(0, 6).map((evento, indice) => (
<div
className="priorityEvent"
key={evento.id}
>
<div
className="priorityBar"
style={{
background: corSeveridade(
evento.severidade
),
}}
/>

<div className="eventRank">
#{String(indice + 1).padStart(2, "0")}
</div>

<div className="eventBody">
<div className="eventTop">
<strong>{evento.titulo}</strong>

<span
style={{
color: corSeveridade(
evento.severidade
),
}}
>
{nivelSeveridade(
evento.severidade
)}
</span>
</div>

<p>{evento.local}</p>

<div className="eventMeta">
<span>{evento.fonte}</span>
<span>
Severidade {evento.severidade}/10
</span>
<span>
{formatarData(evento.data)}
</span>
</div>
</div>
</div>
))}

{!carregando && eventos.length === 0 && (
<div className="loading">
Nenhum evento disponível.
</div>
)}
</div>
</div>
</div>

<aside className="rightColumn">
<div className="brainPanel">
<div className="brain">
<div className="brainRing ring1" />
<div className="brainRing ring2" />
<div className="brainRing ring3" />

<div className="brainCore">
<span>NT</span>
</div>

<div className="orbit orbit1" />
<div className="orbit orbit2" />
<div className="orbit orbit3" />
</div>

<div className="brainTitle">
NEUROTWIN
<strong>Cognitive Core</strong>
</div>

<div className="brainStat">
<span>USGS</span>
<strong>
{analise.terremotos.length} sinais
</strong>
</div>

<div className="brainStat">
<span>GDACS</span>
<strong>
{analise.gdacs.length} sinais
</strong>
</div>

<div className="brainStat">
<span>NASA EONET</span>
<strong>
{analise.nasa.length} sinais
</strong>
</div>

<div className="brainStat">
<span>Integração</span>
<strong>
{fontesOnline === 3
? "OPERACIONAL"
: "DEGRADADA"}
</strong>
</div>
</div>

<div className="decisionPanel">
<span>PRIORIDADE ATUAL</span>

{analise.prioridade ? (
<>
<h3>
{analise.prioridade.titulo}
</h3>

<p>
{analise.prioridade.local}
</p>

<div className="decisionMeta">
<strong>
{
analise.prioridade
.fonte
}
</strong>

<strong
style={{
color: corSeveridade(
analise.prioridade
.severidade
),
}}
>
{analise.prioridade
.severidade}
/10
</strong>
</div>
</>
) : (
<p>
Nenhuma prioridade disponível no momento.
</p>
)}

<Link
href="/dashboard/alertas"
className="investigate"
>
Abrir central de alertas →
</Link>
</div>
</aside>
</section>

<section className="architecture">
<div>
<span>01</span>
<strong>OBSERVAR</strong>
<p>Feeds globais são coletados.</p>
</div>

<div className="arrow">→</div>

<div>
<span>02</span>
<strong>CLASSIFICAR</strong>
<p>Eventos recebem prioridade.</p>
</div>

<div className="arrow">→</div>

<div>
<span>03</span>
<strong>INTERPRETAR</strong>
<p>O Centro Cognitivo cruza os sinais.</p>
</div>

<div className="arrow">→</div>

<div>
<span>04</span>
<strong>DECIDIR</strong>
<p>Informação é preparada para ação.</p>
</div>
</section>

<div className="disclaimer">
O Centro Cognitivo apresenta uma síntese
operacional baseada nos dados recebidos das
fontes integradas. Não substitui alertas,
previsões ou orientações emitidas por
autoridades oficiais.
</div>
</div>

<style jsx>{`
* {
box-sizing: border-box;
}

.page {
min-height: 100vh;
background:
radial-gradient(
circle at 50% 8%,
rgba(0, 111, 255, 0.22),
transparent 30%
),
linear-gradient(
145deg,
#050c17,
#07172a 48%,
#040b14
);
color: #f5f9ff;
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
border-radius: 50%;
filter: blur(140px);
pointer-events: none;
opacity: 0.16;
}

.ambient1 {
width: 600px;
height: 600px;
background: #006cff;
top: -300px;
left: 20%;
}

.ambient2 {
width: 500px;
height: 500px;
background: #00b7ff;
right: -280px;
bottom: -200px;
}

.container {
width: min(1550px, calc(100% - 40px));
margin: auto;
padding: 38px 0 60px;
position: relative;
z-index: 2;
}

.header {
display: flex;
justify-content: space-between;
gap: 30px;
align-items: flex-start;
margin-bottom: 24px;
}

.eyebrow {
color: #31aaff;
font-size: 11px;
font-weight: 900;
letter-spacing: 0.15em;
margin-bottom: 8px;
}

h1 {
margin: 0;
font-size: clamp(38px, 5vw, 65px);
line-height: 0.95;
letter-spacing: -0.05em;
}

.header p {
color: #8bcaff;
margin: 13px 0 0;
}

.actions {
display: flex;
gap: 8px;
flex-wrap: wrap;
justify-content: flex-end;
}

.button {
min-height: 43px;
padding: 0 15px;
border-radius: 11px;
border: 1px solid rgba(41, 140, 255, 0.5);
display: inline-flex;
align-items: center;
justify-content: center;
text-decoration: none;
font-weight: 800;
font-size: 11px;
cursor: pointer;
}

.primary {
color: white;
background: linear-gradient(
135deg,
#006aff,
#00a2ff
);
}

.secondary {
color: #9bd6ff;
background: rgba(9, 30, 53, 0.72);
}

.statusBar {
min-height: 47px;
padding: 0 16px;
display: flex;
align-items: center;
justify-content: space-between;
gap: 20px;
border: 1px solid rgba(43, 136, 255, 0.28);
background: rgba(8, 27, 48, 0.75);
border-radius: 13px;
color: #8ccfff;
font-size: 10px;
font-weight: 900;
letter-spacing: 0.08em;
margin-bottom: 14px;
}

.statusDot {
width: 7px;
height: 7px;
display: inline-block;
background: #25e990;
border-radius: 50%;
margin-right: 8px;
box-shadow: 0 0 14px #25e990;
}

.errorDot {
background: #ff365f;
box-shadow: 0 0 14px #ff365f;
}

.error {
padding: 13px 15px;
border-radius: 12px;
margin-bottom: 14px;
border: 1px solid rgba(255, 54, 95, 0.45);
background: rgba(255, 54, 95, 0.08);
color: #ffafbf;
font-size: 12px;
}

.metrics {
display: grid;
grid-template-columns: repeat(5, 1fr);
gap: 10px;
margin-bottom: 15px;
}

.workspace {
display: grid;
grid-template-columns: minmax(0, 1fr) 340px;
gap: 15px;
}

.leftColumn {
display: flex;
flex-direction: column;
gap: 15px;
min-width: 0;
}

.panel,
.brainPanel,
.decisionPanel {
border: 1px solid rgba(43, 135, 255, 0.27);
background: rgba(7, 23, 42, 0.78);
border-radius: 20px;
backdrop-filter: blur(16px);
}

.panel {
padding: 20px;
}

.panelHeader {
display: flex;
justify-content: space-between;
align-items: flex-end;
gap: 20px;
margin-bottom: 17px;
}

.panelHeader span {
color: #269eff;
font-size: 9px;
font-weight: 900;
letter-spacing: 0.15em;
}

.panelHeader h2 {
margin: 5px 0 0;
font-size: 24px;
}

.processing {
color: #6ad6ff;
font-size: 9px;
font-weight: 900;
letter-spacing: 0.12em;
}

.pulse {
display: inline-block;
width: 7px;
height: 7px;
border-radius: 50%;
background: #27e990;
margin-right: 6px;
box-shadow: 0 0 12px #27e990;
}

.synthesis {
display: grid;
grid-template-columns: repeat(2, 1fr);
gap: 10px;
}

.loading {
padding: 55px 20px;
text-align: center;
color: #7199b9;
}

.priorityList {
display: flex;
flex-direction: column;
gap: 9px;
}

.priorityEvent {
position: relative;
display: grid;
grid-template-columns: 45px 1fr;
gap: 12px;
overflow: hidden;
padding: 14px 14px 14px 18px;
border-radius: 14px;
border: 1px solid rgba(47, 132, 255, 0.22);
background: rgba(10, 32, 57, 0.68);
}

.priorityBar {
position: absolute;
top: 0;
bottom: 0;
left: 0;
width: 3px;
}

.eventRank {
color: #3c8bc8;
font-size: 10px;
font-weight: 900;
}

.eventBody {
min-width: 0;
}

.eventTop {
display: flex;
justify-content: space-between;
gap: 15px;
}

.eventTop strong {
font-size: 14px;
}

.eventTop span {
font-size: 9px;
font-weight: 950;
letter-spacing: 0.08em;
}

.eventBody p {
margin: 5px 0 9px;
color: #83afd1;
font-size: 11px;
}

.eventMeta {
display: flex;
gap: 13px;
flex-wrap: wrap;
color: #577d9c;
font-size: 9px;
}

.rightColumn {
display: flex;
flex-direction: column;
gap: 15px;
}

.brainPanel {
padding: 22px;
}

.brain {
width: 230px;
height: 230px;
margin: 4px auto 20px;
position: relative;
border-radius: 50%;
background:
radial-gradient(
circle,
rgba(0, 183, 255, 0.22),
rgba(0, 86, 181, 0.06) 45%,
transparent 68%
);
}

.brainRing {
position: absolute;
border-radius: 50%;
border: 1px solid rgba(48, 167, 255, 0.26);
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
}

.ring1 {
width: 80px;
height: 80px;
}

.ring2 {
width: 150px;
height: 150px;
}

.ring3 {
width: 220px;
height: 220px;
}

.brainCore {
position: absolute;
width: 64px;
height: 64px;
top: calc(50% - 32px);
left: calc(50% - 32px);
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
background: #078cff;
box-shadow:
0 0 25px rgba(0, 157, 255, 0.8),
0 0 70px rgba(0, 119, 255, 0.5);
}

.brainCore span {
font-size: 17px;
font-weight: 950;
}

.orbit {
position: absolute;
width: 8px;
height: 8px;
border-radius: 50%;
background: #5ee9ff;
box-shadow: 0 0 13px #5ee9ff;
}

.orbit1 {
top: 25px;
left: 50%;
animation: float 3s ease-in-out infinite;
}

.orbit2 {
bottom: 42px;
left: 24px;
animation: float 3.8s ease-in-out infinite;
}

.orbit3 {
right: 26px;
bottom: 55px;
animation: float 4.4s ease-in-out infinite;
}

@keyframes float {
0%,
100% {
transform: scale(0.8);
opacity: 0.5;
}

50% {
transform: scale(1.35);
opacity: 1;
}
}

.brainTitle {
text-align: center;
color: #2ba6ff;
font-size: 9px;
font-weight: 900;
letter-spacing: 0.14em;
margin-bottom: 16px;
}

.brainTitle strong {
display: block;
color: white;
font-size: 20px;
letter-spacing: -0.02em;
margin-top: 4px;
}

.brainStat {
padding: 11px 2px;
border-top: 1px solid rgba(49, 136, 230, 0.16);
display: flex;
justify-content: space-between;
gap: 15px;
}

.brainStat span {
color: #7198b7;
font-size: 10px;
}

.brainStat strong {
color: #d4ecff;
font-size: 10px;
}

.decisionPanel {
padding: 20px;
}

.decisionPanel > span {
color: #2fa7ff;
font-size: 9px;
font-weight: 900;
letter-spacing: 0.14em;
}

.decisionPanel h3 {
margin: 10px 0 7px;
font-size: 18px;
}

.decisionPanel p {
color: #7fa7c6;
font-size: 11px;
line-height: 1.5;
}

.decisionMeta {
display: flex;
justify-content: space-between;
margin: 15px 0;
padding-top: 13px;
border-top: 1px solid rgba(48, 136, 230, 0.18);
font-size: 11px;
}

.investigate {
display: block;
text-decoration: none;
text-align: center;
padding: 11px;
border-radius: 10px;
background: rgba(0, 118, 255, 0.15);
border: 1px solid rgba(43, 145, 255, 0.4);
color: #84cfff;
font-size: 10px;
font-weight: 900;
}

.architecture {
margin-top: 15px;
border: 1px solid rgba(44, 134, 255, 0.22);
background: rgba(7, 23, 42, 0.65);
border-radius: 18px;
padding: 18px;
display: grid;
grid-template-columns:
1fr auto 1fr auto 1fr auto 1fr;
gap: 15px;
align-items: center;
}

.architecture div:not(.arrow) {
text-align: center;
}

.architecture span {
display: block;
color: #218fff;
font-size: 9px;
font-weight: 900;
}

.architecture strong {
display: block;
margin: 5px 0;
font-size: 11px;
}

.architecture p {
margin: 0;
color: #668aa7;
font-size: 9px;
}

.arrow {
color: #1e87e3;
}

.disclaimer {
margin-top: 13px;
color: #4f708c;
font-size: 9px;
line-height: 1.5;
text-align: center;
}

@media (max-width: 1150px) {
.metrics {
grid-template-columns: repeat(3, 1fr);
}

.workspace {
grid-template-columns: 1fr;
}

.rightColumn {
display: grid;
grid-template-columns: 1fr 1fr;
}
}

@media (max-width: 760px) {
.container {
width: calc(100% - 22px);
padding-top: 23px;
}

.header {
flex-direction: column;
}

.actions {
justify-content: flex-start;
}

.metrics {
grid-template-columns: repeat(2, 1fr);
}

.synthesis {
grid-template-columns: 1fr;
}

.rightColumn {
display: flex;
}

.statusBar {
align-items: flex-start;
flex-direction: column;
padding: 12px 15px;
}

.architecture {
grid-template-columns: 1fr;
}

.arrow {
transform: rotate(90deg);
text-align: center;
}
}
`}</style>
</main>
);
}

function Metric({
titulo,
valor,
legenda,
cor,
}: {
titulo: string;
valor: string;
legenda: string;
cor?: string;
}) {
return (
<div className="metric">
<span>{titulo}</span>

<strong
style={{
color: cor || "#ffffff",
}}
>
{valor}
</strong>

<p>{legenda}</p>

<style jsx>{`
.metric {
min-height: 95px;
padding: 15px;
border-radius: 15px;
border: 1px solid rgba(47, 134, 255, 0.28);
background: linear-gradient(
145deg,
rgba(15, 43, 74, 0.86),
rgba(8, 26, 47, 0.75)
);
}

span {
color: #5eaff0;
display: block;
font-size: 9px;
margin-bottom: 8px;
}

strong {
display: block;
font-size: 20px;
line-height: 1.05;
overflow-wrap: anywhere;
}

p {
margin: 7px 0 0;
color: #547996;
font-size: 9px;
}
`}</style>
</div>
);
}

function Insight({
numero,
titulo,
texto,
}: {
numero: string;
titulo: string;
texto: string;
}) {
return (
<article className="insight">
<div className="number">{numero}</div>

<div>
<h3>{titulo}</h3>
<p>{texto}</p>
</div>

<style jsx>{`
.insight {
min-height: 120px;
padding: 15px;
border-radius: 14px;
border: 1px solid rgba(46, 135, 255, 0.22);
background: rgba(9, 31, 55, 0.68);
display: grid;
grid-template-columns: 35px 1fr;
gap: 10px;
}

.number {
color: #248fff;
font-size: 10px;
font-weight: 950;
}

h3 {
margin: 0 0 7px;
font-size: 13px;
}

p {
margin: 0;
color: #83a8c5;
font-size: 10px;
line-height: 1.55;
}
`}</style>
</article>
);
}