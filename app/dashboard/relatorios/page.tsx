"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type EventoExecutivo = {
id: string;
titulo: string;
tipo: string;
fonte: "USGS" | "GDACS" | "NASA EONET";
severidade: number;
nivel: "CRÍTICO" | "ALTO" | "ATENÇÃO";
local: string;
data: string | number | null;
magnitude?: number;
};

function normalizarTexto(valor: unknown) {
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

function nivelPorSeveridade(
severidade: number
): "CRÍTICO" | "ALTO" | "ATENÇÃO" {
if (severidade >= 9) return "CRÍTICO";
if (severidade >= 6) return "ALTO";
return "ATENÇÃO";
}

function corNivel(nivel: EventoExecutivo["nivel"]) {
if (nivel === "CRÍTICO") return "#ff4568";
if (nivel === "ALTO") return "#ff9f2f";
return "#ffd84d";
}

export default function RelatoriosExecutivosPage() {
const [dados, setDados] = useState<any>(null);
const [carregando, setCarregando] = useState(true);
const [erro, setErro] = useState("");
const [ultimaAtualizacao, setUltimaAtualizacao] = useState<Date | null>(
null
);

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
"Não foi possível atualizar os dados executivos neste momento."
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

const eventos = useMemo<EventoExecutivo[]>(() => {
if (!dados) return [];

const lista: EventoExecutivo[] = [];

/*
* USGS
*/
const terremotos = Array.isArray(dados?.terremotos)
? dados.terremotos
: [];

terremotos.forEach((item: any, indice: number) => {
const magnitude = Number(item?.magnitude ?? 0);
const tsunami = item?.tsunami === true;

let severidade = 2;

if (tsunami) severidade = 10;
else if (magnitude >= 7) severidade = 10;
else if (magnitude >= 6) severidade = 9;
else if (magnitude >= 5) severidade = 7;
else if (magnitude >= 4.5) severidade = 5;
else if (magnitude >= 4) severidade = 4;

lista.push({
id: `usgs-${item?.id ?? indice}`,
titulo: tsunami
? `Terremoto M ${magnitude.toFixed(
1
)} com indicação de tsunami`
: `Terremoto M ${magnitude.toFixed(1)}`,
tipo: tsunami ? "Terremoto / Tsunami" : "Terremoto",
fonte: "USGS",
severidade,
nivel: nivelPorSeveridade(severidade),
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
const alerta = normalizarTexto(
item?.alerta ??
item?.alertlevel ??
item?.alertLevel ??
item?.nivel
);

let severidade = 5;

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
nivel: nivelPorSeveridade(severidade),
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

const texto = normalizarTexto(
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
nivel: nivelPorSeveridade(severidade),
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

const terremotos = useMemo(
() =>
eventos.filter((evento) => evento.fonte === "USGS"),
[eventos]
);

const gdacs = useMemo(
() =>
eventos.filter((evento) => evento.fonte === "GDACS"),
[eventos]
);

const nasa = useMemo(
() =>
eventos.filter(
(evento) => evento.fonte === "NASA EONET"
),
[eventos]
);

const criticos = eventos.filter(
(evento) => evento.nivel === "CRÍTICO"
);

const altos = eventos.filter(
(evento) => evento.nivel === "ALTO"
);

const maiorTerremoto = useMemo(() => {
return [...terremotos].sort(
(a, b) =>
Number(b.magnitude ?? 0) -
Number(a.magnitude ?? 0)
)[0];
}, [terremotos]);

const fontesOnline = [
dados?.fontes?.usgs?.status,
dados?.fontes?.nasaEonet?.status,
dados?.fontes?.gdacs?.status,
].filter((status) => status === "online").length;

const estadoGlobal =
criticos.length > 0
? "PRIORIDADE MÁXIMA"
: altos.length >= 5
? "ATENÇÃO ELEVADA"
: altos.length > 0
? "MONITORAMENTO"
: "ESTÁVEL";

const corEstado =
criticos.length > 0
? "#ff4568"
: altos.length >= 5
? "#ff9f2f"
: "#46dcff";

const principaisEventos = eventos
.filter((evento) => evento.severidade >= 5)
.slice(0, 6);

return (
<main className="page">
<div className="ambient ambient1" />
<div className="ambient ambient2" />

<div className="container">
<header className="header">
<div>
<div className="eyebrow">
NEUROTWIN 2050 · EXECUTIVE INTELLIGENCE
</div>

<h1>Relatórios Executivos</h1>

<p>
Consolidação operacional automática dos sinais
globais monitorados pelo NeuroTwin.
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

<button
className="button primary"
onClick={carregar}
disabled={carregando}
>
{carregando
? "Atualizando..."
: "Atualizar inteligência"}
</button>
</div>
</header>

<section className="statusBar">
<div>
<span className="liveDot" />
RELATÓRIO OPERACIONAL EM TEMPO REAL
</div>

<span>
{ultimaAtualizacao
? `Última síntese: ${ultimaAtualizacao.toLocaleTimeString(
"pt-BR"
)}`
: "Sincronizando..."}
</span>
</section>

{erro && (
<div className="error">
<strong>Conexão degradada.</strong> {erro}
</div>
)}

<section className="metrics">
<Metric
label="Fontes"
value={`${fontesOnline}/3`}
detail="feeds operacionais"
/>

<Metric
label="Eventos"
value={String(eventos.length)}
detail="sinais processados"
/>

<Metric
label="Críticos"
value={String(criticos.length)}
detail="prioridade máxima"
color="#ff4568"
/>

<Metric
label="Alta prioridade"
value={String(altos.length)}
detail="requer atenção"
color="#ff9f2f"
/>

<Metric
label="Estado"
value={estadoGlobal}
detail="classificação operacional"
color={corEstado}
wide
/>
</section>

<section className="executiveGrid">
<div className="mainColumn">
<section className="panel synthesis">
<div className="panelHeader">
<div>
<span>COGNITIVE SYNTHESIS</span>
<h2>Síntese Global</h2>
</div>

<div className="live">
<span className="liveDot" />
LIVE
</div>
</div>

{carregando && !dados ? (
<div className="loading">
O NeuroTwin está processando os feeds
globais...
</div>
) : (
<div className="synthesisGrid">
<SynthesisCard
number="01"
title="Estado operacional"
text={
criticos.length > 0
? `${criticos.length} evento(s) classificado(s) em prioridade máxima exigem acompanhamento.`
: altos.length > 0
? `${altos.length} evento(s) encontram-se classificados em alta prioridade.`
: "Nenhum evento de prioridade máxima foi identificado no conjunto atual."
}
/>

<SynthesisCard
number="02"
title="Atividade sísmica"
text={
maiorTerremoto
? `O maior terremoto presente no conjunto atual possui magnitude ${Number(
maiorTerremoto.magnitude ?? 0
).toFixed(1)} e está associado a ${maiorTerremoto.local}.`
: "Nenhum registro sísmico disponível no conjunto atual."
}
/>

<SynthesisCard
number="03"
title="Desastres globais"
text={`${gdacs.length} evento(s) do GDACS estão sendo considerados pela síntese operacional.`}
/>

<SynthesisCard
number="04"
title="Eventos ambientais"
text={`${nasa.length} evento(s) provenientes da NASA EONET estão integrados ao núcleo cognitivo.`}
/>
</div>
)}
</section>

<section className="panel priority">
<div className="panelHeader">
<div>
<span>PRIORITY ENGINE</span>
<h2>Eventos de Maior Relevância</h2>
</div>

<Link
href="/dashboard/alertas"
className="smallLink"
>
Abrir Alertas Críticos →
</Link>
</div>

{principaisEventos.length === 0 ? (
<div className="loading">
Nenhum evento prioritário disponível.
</div>
) : (
<div className="events">
{principaisEventos.map(
(evento, indice) => (
<article
className="event"
key={evento.id}
>
<div
className="eventLine"
style={{
background: corNivel(
evento.nivel
),
}}
/>

<div className="eventTop">
<span className="eventRank">
#
{String(indice + 1).padStart(
2,
"0"
)}
</span>

<span
className="badge"
style={{
color: corNivel(
evento.nivel
),
borderColor: `${corNivel(
evento.nivel
)}70`,
}}
>
{evento.nivel}
</span>
</div>

<h3>{evento.titulo}</h3>

<p>{evento.local}</p>

<div className="eventMeta">
<span>{evento.fonte}</span>
<span>
{formatarData(evento.data)}
</span>
<strong>
{evento.severidade}/10
</strong>
</div>
</article>
)
)}
</div>
)}
</section>

<section className="reportsGrid">
<ReportCard
code="R-01"
title="Relatório Sísmico"
value={`${terremotos.length} eventos`}
description={
maiorTerremoto
? `Magnitude máxima atual: ${Number(
maiorTerremoto.magnitude ?? 0
).toFixed(1)}.`
: "Sem dados sísmicos disponíveis."
}
/>

<ReportCard
code="R-02"
title="Relatório de Desastres"
value={`${gdacs.length} eventos`}
description="Consolidação dos sinais recebidos do GDACS."
/>

<ReportCard
code="R-03"
title="Relatório Ambiental"
value={`${nasa.length} eventos`}
description="Monitoramento de fenômenos naturais via NASA EONET."
/>
</section>
</div>

<aside className="sidePanel">
<div className="core">
<div className="orbit orbit1" />
<div className="orbit orbit2" />
<div className="orbit orbit3" />

<div className="satellite sat1" />
<div className="satellite sat2" />
<div className="satellite sat3" />

<div className="coreCenter">
NT
</div>
</div>

<div className="coreTitle">
<span>NEUROTWIN</span>
<strong>Executive Core</strong>
</div>

<SideRow
label="USGS"
value={`${terremotos.length} sinais`}
/>

<SideRow
label="GDACS"
value={`${gdacs.length} sinais`}
/>

<SideRow
label="NASA EONET"
value={`${nasa.length} sinais`}
/>

<SideRow
label="Prioridade máxima"
value={String(criticos.length)}
color={
criticos.length > 0
? "#ff4568"
: "#46dcff"
}
/>

<div className="decision">
<span>DECISION SUPPORT</span>

<h3>{estadoGlobal}</h3>

<p>
A classificação é produzida a partir dos
dados atualmente recebidos pelas fontes
integradas ao NeuroTwin.
</p>
</div>

<div className="disclaimer">
Este painel oferece inteligência operacional e
não substitui comunicados oficiais de
autoridades, serviços meteorológicos ou
organismos de emergência.
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
circle at 45% 0%,
rgba(0, 117, 255, 0.24),
transparent 35%
),
linear-gradient(
145deg,
#06101d 0%,
#07182a 50%,
#040b15 100%
);
color: #f4f9ff;
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
filter: blur(130px);
pointer-events: none;
opacity: 0.15;
}

.ambient1 {
width: 600px;
height: 600px;
background: #006dff;
top: -300px;
left: 30%;
}

.ambient2 {
width: 500px;
height: 500px;
background: #00b7ff;
right: -300px;
bottom: -200px;
}

.container {
width: min(1540px, calc(100% - 36px));
margin: 0 auto;
padding: 32px 0 70px;
position: relative;
z-index: 2;
}

.header {
display: flex;
align-items: flex-start;
justify-content: space-between;
gap: 28px;
margin-bottom: 22px;
}

.eyebrow {
color: #3aaaff;
font-size: 11px;
font-weight: 900;
letter-spacing: 0.16em;
margin-bottom: 7px;
}

h1 {
margin: 0;
font-size: clamp(35px, 4vw, 58px);
line-height: 1;
letter-spacing: -0.045em;
}

.header p {
color: #82bde9;
margin: 11px 0 0;
font-size: 14px;
}

.actions {
display: flex;
flex-wrap: wrap;
justify-content: flex-end;
gap: 9px;
}

.button {
min-height: 43px;
border-radius: 11px;
border: 1px solid rgba(39, 139, 255, 0.5);
padding: 0 16px;
display: inline-flex;
align-items: center;
justify-content: center;
text-decoration: none;
cursor: pointer;
font-size: 11px;
font-weight: 900;
}

.primary {
background: linear-gradient(
135deg,
#006dff,
#00a2ff
);
color: white;
}

.secondary {
color: #a9dcff;
background: rgba(9, 29, 51, 0.75);
}

.statusBar {
display: flex;
justify-content: space-between;
gap: 20px;
padding: 12px 15px;
margin-bottom: 12px;
border: 1px solid rgba(42, 133, 255, 0.3);
border-radius: 13px;
background: rgba(8, 26, 47, 0.75);
color: #79bce9;
font-size: 10px;
font-weight: 900;
letter-spacing: 0.06em;
}

.liveDot {
width: 7px;
height: 7px;
display: inline-block;
border-radius: 50%;
background: #37ed96;
box-shadow: 0 0 13px #37ed96;
margin-right: 7px;
}

.error {
padding: 12px 15px;
border: 1px solid rgba(255, 69, 104, 0.45);
background: rgba(255, 69, 104, 0.08);
border-radius: 12px;
color: #ffb5c2;
margin-bottom: 12px;
font-size: 12px;
}

.metrics {
display: grid;
grid-template-columns:
repeat(4, minmax(0, 1fr))
minmax(220px, 1.4fr);
gap: 10px;
margin-bottom: 14px;
}

.executiveGrid {
display: grid;
grid-template-columns: minmax(0, 1fr) 310px;
gap: 14px;
}

.mainColumn {
min-width: 0;
}

.panel,
.sidePanel {
border: 1px solid rgba(48, 133, 255, 0.28);
background: rgba(7, 24, 43, 0.78);
border-radius: 19px;
backdrop-filter: blur(14px);
}

.panel {
padding: 20px;
margin-bottom: 14px;
}

.panelHeader {
display: flex;
justify-content: space-between;
align-items: flex-end;
gap: 20px;
margin-bottom: 16px;
}

.panelHeader span {
color: #39a8ff;
font-size: 9px;
font-weight: 900;
letter-spacing: 0.14em;
}

.panelHeader h2 {
margin: 4px 0 0;
font-size: 24px;
letter-spacing: -0.025em;
}

.live {
color: #45e89b;
font-size: 9px;
font-weight: 900;
}

.synthesisGrid {
display: grid;
grid-template-columns: 1fr 1fr;
gap: 10px;
}

.loading {
padding: 50px 20px;
text-align: center;
color: #729bb9;
}

.smallLink {
color: #63c3ff;
text-decoration: none;
font-size: 10px;
font-weight: 900;
}

.events {
display: grid;
grid-template-columns: repeat(2, 1fr);
gap: 10px;
}

.event {
position: relative;
overflow: hidden;
border: 1px solid rgba(48, 133, 255, 0.22);
border-radius: 14px;
background: rgba(12, 38, 67, 0.7);
padding: 15px 15px 14px 18px;
}

.eventLine {
position: absolute;
left: 0;
top: 0;
bottom: 0;
width: 3px;
}

.eventTop {
display: flex;
justify-content: space-between;
gap: 10px;
align-items: center;
}

.eventRank {
color: #5595c6;
font-size: 9px;
font-weight: 900;
}

.badge {
border: 1px solid;
border-radius: 999px;
padding: 3px 7px;
font-size: 8px;
font-weight: 950;
}

.event h3 {
margin: 10px 0 5px;
font-size: 15px;
}

.event p {
margin: 0 0 11px;
color: #8cb6d4;
font-size: 10px;
}

.eventMeta {
display: flex;
align-items: center;
flex-wrap: wrap;
gap: 8px 14px;
color: #6496ba;
font-size: 8px;
}

.eventMeta strong {
color: #d8efff;
}

.reportsGrid {
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 10px;
}

.sidePanel {
padding: 20px;
height: fit-content;
position: sticky;
top: 20px;
}

.core {
width: 220px;
height: 220px;
position: relative;
margin: 5px auto 15px;
}

.orbit {
position: absolute;
top: 50%;
left: 50%;
border-radius: 50%;
border: 1px solid rgba(52, 168, 255, 0.28);
transform: translate(-50%, -50%);
}

.orbit1 {
width: 80px;
height: 80px;
}

.orbit2 {
width: 145px;
height: 145px;
}

.orbit3 {
width: 210px;
height: 210px;
}

.coreCenter {
position: absolute;
top: 50%;
left: 50%;
width: 64px;
height: 64px;
transform: translate(-50%, -50%);
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
background: radial-gradient(
circle,
#2edcff,
#0078ff 55%,
#072d5b
);
box-shadow:
0 0 25px #00a7ff,
0 0 65px rgba(0, 130, 255, 0.55);
font-weight: 950;
font-size: 18px;
}

.satellite {
position: absolute;
width: 7px;
height: 7px;
border-radius: 50%;
background: #64f4ff;
box-shadow: 0 0 12px #64f4ff;
}

.sat1 {
top: 10px;
left: 106px;
}

.sat2 {
right: 8px;
top: 115px;
}

.sat3 {
left: 24px;
bottom: 30px;
}

.coreTitle {
text-align: center;
margin-bottom: 18px;
}

.coreTitle span {
display: block;
color: #3baaff;
font-size: 9px;
font-weight: 900;
letter-spacing: 0.14em;
}

.coreTitle strong {
display: block;
font-size: 20px;
margin-top: 4px;
}

.decision {
margin-top: 15px;
border: 1px solid rgba(45, 139, 255, 0.24);
background: rgba(11, 37, 65, 0.7);
border-radius: 13px;
padding: 14px;
}

.decision span {
color: #38a9ff;
font-size: 8px;
font-weight: 950;
letter-spacing: 0.13em;
}

.decision h3 {
margin: 7px 0;
font-size: 16px;
}

.decision p {
margin: 0;
color: #7fa5c1;
font-size: 9px;
line-height: 1.5;
}

.disclaimer {
margin-top: 12px;
color: #6689a4;
font-size: 8px;
line-height: 1.5;
padding: 0 3px;
}

@media (max-width: 1150px) {
.metrics {
grid-template-columns: repeat(3, 1fr);
}

.executiveGrid {
grid-template-columns: 1fr;
}

.sidePanel {
position: relative;
top: 0;
}
}

@media (max-width: 760px) {
.container {
width: calc(100% - 20px);
padding-top: 20px;
}

.header {
flex-direction: column;
}

.actions {
justify-content: flex-start;
}

.metrics {
grid-template-columns: 1fr 1fr;
}

.synthesisGrid,
.events,
.reportsGrid {
grid-template-columns: 1fr;
}

.statusBar,
.panelHeader {
flex-direction: column;
align-items: flex-start;
}
}
`}</style>
</main>
);
}

function Metric({
label,
value,
detail,
color,
wide = false,
}: {
label: string;
value: string;
detail: string;
color?: string;
wide?: boolean;
}) {
return (
<div className={`metric ${wide ? "wide" : ""}`}>
<span>{label}</span>

<strong style={{ color: color || "#ffffff" }}>
{value}
</strong>

<small>{detail}</small>

<style jsx>{`
.metric {
min-height: 90px;
padding: 14px;
border: 1px solid rgba(48, 133, 255, 0.28);
border-radius: 14px;
background: linear-gradient(
145deg,
rgba(16, 44, 76, 0.82),
rgba(7, 25, 45, 0.8)
);
}

span {
display: block;
color: #5db7f8;
font-size: 9px;
margin-bottom: 8px;
}

strong {
display: block;
font-size: 21px;
line-height: 1.05;
overflow-wrap: anywhere;
}

small {
display: block;
margin-top: 6px;
color: #648ba8;
font-size: 8px;
}
`}</style>
</div>
);
}

function SynthesisCard({
number,
title,
text,
}: {
number: string;
title: string;
text: string;
}) {
return (
<article className="synthesisCard">
<span>{number}</span>

<div>
<h3>{title}</h3>
<p>{text}</p>
</div>

<style jsx>{`
.synthesisCard {
min-height: 105px;
display: grid;
grid-template-columns: 34px 1fr;
gap: 8px;
padding: 15px;
border: 1px solid rgba(45, 139, 255, 0.24);
background: rgba(13, 40, 69, 0.68);
border-radius: 14px;
}

span {
color: #2fa8ff;
font-size: 9px;
font-weight: 950;
}

h3 {
margin: 0 0 7px;
font-size: 13px;
}

p {
margin: 0;
color: #91b3cc;
font-size: 9px;
line-height: 1.55;
}
`}</style>
</article>
);
}

function ReportCard({
code,
title,
value,
description,
}: {
code: string;
title: string;
value: string;
description: string;
}) {
return (
<article className="reportCard">
<span>{code}</span>

<h3>{title}</h3>

<strong>{value}</strong>

<p>{description}</p>

<style jsx>{`
.reportCard {
min-height: 150px;
padding: 17px;
border: 1px solid rgba(48, 133, 255, 0.26);
border-radius: 15px;
background: linear-gradient(
145deg,
rgba(14, 42, 72, 0.85),
rgba(7, 24, 43, 0.9)
);
}

span {
color: #37aaff;
font-size: 9px;
font-weight: 950;
letter-spacing: 0.12em;
}

h3 {
margin: 9px 0 12px;
font-size: 15px;
}

strong {
color: #66d7ff;
font-size: 19px;
}

p {
margin: 8px 0 0;
color: #789db9;
font-size: 9px;
line-height: 1.5;
}
`}</style>
</article>
);
}

function SideRow({
label,
value,
color,
}: {
label: string;
value: string;
color?: string;
}) {
return (
<div className="sideRow">
<span>{label}</span>

<strong style={{ color: color || "#d9efff" }}>
{value}
</strong>

<style jsx>{`
.sideRow {
display: flex;
justify-content: space-between;
align-items: center;
gap: 12px;
padding: 12px 2px;
border-top: 1px solid rgba(52, 137, 229, 0.16);
}

span {
color: #789ebc;
font-size: 9px;
}

strong {
font-size: 10px;
text-align: right;
}
`}</style>
</div>
);
}