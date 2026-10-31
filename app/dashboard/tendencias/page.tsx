"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type Nivel = "CRÍTICA" | "ALTA" | "MODERADA" | "EMERGENTE";

type Tendencia = {
id: string;
titulo: string;
categoria: string;
descricao: string;
nivel: Nivel;
intensidade: number;
horizonte: string;
fonte: string;
};

function texto(valor: unknown) {
return String(valor ?? "").toLowerCase();
}

function corNivel(nivel: Nivel) {
if (nivel === "CRÍTICA") return "#ff3b68";
if (nivel === "ALTA") return "#ff9f43";
if (nivel === "MODERADA") return "#ffd84d";
return "#39d8ff";
}

export default function TendenciasPage() {
const [dados, setDados] = useState<any>(null);
const [carregando, setCarregando] = useState(true);
const [erro, setErro] = useState("");
const [ultimaAtualizacao, setUltimaAtualizacao] = useState("");

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
setUltimaAtualizacao(
new Date().toLocaleTimeString("pt-BR")
);
} catch (error) {
console.error(error);
setErro(
"Não foi possível sincronizar todas as fontes neste momento."
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

return () => {
window.clearInterval(intervalo);
};
}, [carregar]);

const terremotos = useMemo(() => {
return Array.isArray(dados?.terremotos)
? dados.terremotos
: [];
}, [dados]);

const eventosGDACS = useMemo(() => {
return Array.isArray(dados?.eventosGDACS)
? dados.eventosGDACS
: [];
}, [dados]);

const eventosNaturais = useMemo(() => {
return Array.isArray(dados?.eventosNaturais)
? dados.eventosNaturais
: [];
}, [dados]);

const maiorMagnitude = useMemo(() => {
if (terremotos.length === 0) return 0;

return Math.max(
...terremotos.map((item: any) =>
Number(item?.magnitude ?? 0)
)
);
}, [terremotos]);

const terremotosRelevantes = useMemo(() => {
return terremotos.filter(
(item: any) => Number(item?.magnitude ?? 0) >= 5
).length;
}, [terremotos]);

const eventosSeverosGDACS = useMemo(() => {
return eventosGDACS.filter((item: any) => {
const nivel = texto(
item?.alerta ??
item?.alertlevel ??
item?.alertLevel ??
item?.nivel
);

return (
nivel.includes("red") ||
nivel.includes("vermelho") ||
nivel.includes("orange") ||
nivel.includes("laranja")
);
}).length;
}, [eventosGDACS]);

const eventosAmbientaisRelevantes = useMemo(() => {
return eventosNaturais.filter((item: any) => {
const categorias = Array.isArray(item?.categorias)
? item.categorias.join(" ")
: "";

const conteudo = texto(
`${item?.titulo ?? ""} ${categorias}`
);

return (
conteudo.includes("wildfire") ||
conteudo.includes("fire") ||
conteudo.includes("incênd") ||
conteudo.includes("volcano") ||
conteudo.includes("vulc") ||
conteudo.includes("cyclone") ||
conteudo.includes("ciclone") ||
conteudo.includes("hurricane") ||
conteudo.includes("typhoon") ||
conteudo.includes("flood") ||
conteudo.includes("enchente")
);
}).length;
}, [eventosNaturais]);

const totalSinais =
terremotos.length +
eventosGDACS.length +
eventosNaturais.length;

const fontesOnline = [
dados?.fontes?.usgs?.status,
dados?.fontes?.nasaEonet?.status,
dados?.fontes?.gdacs?.status,
].filter((status) => status === "online").length;

const tendencias = useMemo<Tendencia[]>(() => {
const lista: Tendencia[] = [];

if (maiorMagnitude >= 6) {
lista.push({
id: "atividade-sismica",
titulo: "Atividade sísmica elevada",
categoria: "GEODINÂMICA",
descricao:
"O núcleo detecta atividade sísmica de alta magnitude no conjunto global monitorado.",
nivel: maiorMagnitude >= 7 ? "CRÍTICA" : "ALTA",
intensidade: Math.min(
100,
Math.round(maiorMagnitude * 12)
),
horizonte: "Imediato",
fonte: "USGS",
});
} else {
lista.push({
id: "atividade-sismica",
titulo: "Atividade sísmica global",
categoria: "GEODINÂMICA",
descricao:
"O sistema acompanha a distribuição e a intensidade dos eventos sísmicos em escala global.",
nivel: "MODERADA",
intensidade: Math.min(
70,
30 + terremotosRelevantes * 4
),
horizonte: "Curto prazo",
fonte: "USGS",
});
}

if (eventosSeverosGDACS > 0) {
lista.push({
id: "desastres-globais",
titulo: "Pressão de desastres globais",
categoria: "RESILIÊNCIA",
descricao:
`${eventosSeverosGDACS} evento(s) de maior severidade exigem acompanhamento operacional.`,
nivel:
eventosSeverosGDACS >= 5 ? "CRÍTICA" : "ALTA",
intensidade: Math.min(
100,
55 + eventosSeverosGDACS * 7
),
horizonte: "Imediato",
fonte: "GDACS",
});
} else {
lista.push({
id: "desastres-globais",
titulo: "Resiliência e resposta global",
categoria: "RESILIÊNCIA",
descricao:
"O monitoramento permanece ativo para alterações relevantes em desastres e emergências internacionais.",
nivel: "EMERGENTE",
intensidade: 38,
horizonte: "Contínuo",
fonte: "GDACS",
});
}

lista.push({
id: "clima-extremo",
titulo: "Eventos ambientais extremos",
categoria: "CLIMA",
descricao:
eventosAmbientaisRelevantes > 0
? `${eventosAmbientaisRelevantes} evento(s) ambiental(is) relevante(s) estão presentes no fluxo atual.`
: "O núcleo mantém vigilância sobre incêndios, ciclones, enchentes e atividade vulcânica.",
nivel:
eventosAmbientaisRelevantes >= 10
? "ALTA"
: eventosAmbientaisRelevantes > 0
? "MODERADA"
: "EMERGENTE",
intensidade: Math.min(
100,
35 + eventosAmbientaisRelevantes * 4
),
horizonte: "Curto prazo",
fonte: "NASA EONET",
});

lista.push({
id: "ia-generativa",
titulo: "Inteligência artificial aplicada",
categoria: "TECNOLOGIA",
descricao:
"IA, automação e sistemas cognitivos permanecem como vetor estrutural de transformação tecnológica e operacional.",
nivel: "ALTA",
intensidade: 92,
horizonte: "2026–2030",
fonte: "NeuroTwin Intelligence",
});

lista.push({
id: "energia",
titulo: "Transição energética",
categoria: "ENERGIA",
descricao:
"Eletrificação, geração distribuída, armazenamento e eficiência energética permanecem no radar estratégico.",
nivel: "ALTA",
intensidade: 84,
horizonte: "2026–2035",
fonte: "NeuroTwin Intelligence",
});

lista.push({
id: "cidades",
titulo: "Infraestrutura e cidades inteligentes",
categoria: "CIDADES",
descricao:
"Sensoriamento, conectividade, mobilidade, automação urbana e gestão orientada por dados formam um eixo de longo prazo.",
nivel: "MODERADA",
intensidade: 76,
horizonte: "2026–2040",
fonte: "NeuroTwin Intelligence",
});

return lista.sort(
(a, b) => b.intensidade - a.intensidade
);
}, [
maiorMagnitude,
terremotosRelevantes,
eventosSeverosGDACS,
eventosAmbientaisRelevantes,
]);

const tendenciaPrincipal = tendencias[0];

const estado =
fontesOnline === 3
? "OPERACIONAL"
: fontesOnline > 0
? "DEGRADADO"
: "SEM SINCRONIA";

return (
<main className="page">
<div className="glow glow1" />
<div className="glow glow2" />

<div className="container">
<header className="header">
<div>
<div className="eyebrow">
NEUROTWIN 2050 · STRATEGIC FORESIGHT
</div>

<h1>Tendências Estratégicas</h1>

<p>
Radar prospectivo para identificar sinais,
padrões emergentes e vetores de transformação.
</p>
</div>

<div className="actions">
<Link
href="/dashboard"
className="button secondary"
>
← Painel
</Link>

<button
className="button primary"
onClick={carregar}
disabled={carregando}
>
{carregando
? "Sincronizando..."
: "Atualizar radar"}
</button>
</div>
</header>

<section className="statusBar">
<div>
<span className="liveDot" />
RADAR ESTRATÉGICO {estado}
</div>

<div>
{ultimaAtualizacao
? `Última síntese: ${ultimaAtualizacao}`
: "Inicializando inteligência"}
</div>
</section>

{erro && (
<div className="error">
<strong>Sincronização parcial.</strong>{" "}
{erro}
</div>
)}

<section className="metrics">
<Metric
label="Fontes"
value={`${fontesOnline}/3`}
detail="feeds operacionais"
/>

<Metric
label="Sinais"
value={String(totalSinais)}
detail="eventos processados"
/>

<Metric
label="Tendências"
value={String(tendencias.length)}
detail="vetores estratégicos"
/>

<Metric
label="Sísmicos M5+"
value={String(terremotosRelevantes)}
detail="atividade relevante"
/>

<Metric
label="Ambientais"
value={String(eventosAmbientaisRelevantes)}
detail="sinais relevantes"
/>
</section>

<section className="layout">
<div className="mainPanel">
<div className="sectionHeader">
<div>
<span>FORESIGHT ENGINE</span>
<h2>Radar de Transformações</h2>
</div>

<div className="live">
<span className="liveDot" />
LIVE
</div>
</div>

<div className="trendGrid">
{tendencias.map((item, index) => (
<article
className="trendCard"
key={item.id}
>
<div className="trendTop">
<div className="trendNumber">
{String(index + 1).padStart(2, "0")}
</div>

<div
className="level"
style={{
color: corNivel(item.nivel),
borderColor: `${corNivel(
item.nivel
)}70`,
background: `${corNivel(
item.nivel
)}10`,
}}
>
{item.nivel}
</div>
</div>

<div className="category">
{item.categoria}
</div>

<h3>{item.titulo}</h3>

<p>{item.descricao}</p>

<div className="progressHeader">
<span>INTENSIDADE</span>
<strong>
{item.intensidade}%
</strong>
</div>

<div className="progress">
<div
className="progressValue"
style={{
width: `${item.intensidade}%`,
background: corNivel(item.nivel),
}}
/>
</div>

<div className="trendFooter">
<div>
<span>Horizonte</span>
<strong>{item.horizonte}</strong>
</div>

<div>
<span>Fonte</span>
<strong>{item.fonte}</strong>
</div>
</div>
</article>
))}
</div>
</div>

<aside className="intelligence">
<div className="radar">
<div className="orbit orbit1" />
<div className="orbit orbit2" />
<div className="orbit orbit3" />
<div className="radarHorizontal" />
<div className="radarVertical" />
<div className="sweep" />

<div className="core">
<span>NT</span>
</div>

<div className="signal signal1" />
<div className="signal signal2" />
<div className="signal signal3" />
</div>

<div className="coreTitle">
NEUROTWIN
<strong>Foresight Core</strong>
</div>

{tendenciaPrincipal && (
<div className="principal">
<span>SINAL DOMINANTE</span>

<strong>
{tendenciaPrincipal.titulo}
</strong>

<p>
Intensidade estratégica de{" "}
{tendenciaPrincipal.intensidade}%.
</p>
</div>
)}

<IntelRow
label="Maior magnitude"
value={
maiorMagnitude > 0
? `M ${maiorMagnitude.toFixed(1)}`
: "—"
}
/>

<IntelRow
label="GDACS severos"
value={String(eventosSeverosGDACS)}
/>

<IntelRow
label="Eventos ambientais"
value={String(
eventosAmbientaisRelevantes
)}
/>

<IntelRow
label="Núcleo"
value={estado}
/>

<div className="note">
O módulo de Tendências interpreta sinais do
ecossistema NeuroTwin para apoiar análise
prospectiva. Ele permanece independente do
Observatório Global: o Observatório detecta
eventos; Tendências procura padrões e vetores
de transformação.
</div>
</aside>
</section>

<section className="horizon">
<div className="sectionHeader">
<div>
<span>STRATEGIC HORIZON</span>
<h2>Horizontes de Decisão</h2>
</div>
</div>

<div className="horizonGrid">
<HorizonCard
number="01"
title="Agora"
text="Eventos e alterações que exigem leitura operacional imediata."
/>

<HorizonCard
number="02"
title="Próximos anos"
text="Vetores com potencial de alterar mercados, infraestrutura e operações."
/>

<HorizonCard
number="03"
title="2030+"
text="Transformações estruturais que devem alimentar cenários e decisões de longo prazo."
/>
</div>
</section>
</div>

<style jsx>{`
* {
box-sizing: border-box;
}

.page {
min-height: 100vh;
position: relative;
overflow: hidden;
color: #f4f9ff;
background:
radial-gradient(
circle at 50% 5%,
rgba(0, 119, 255, 0.2),
transparent 34%
),
linear-gradient(
145deg,
#06111f 0%,
#081a2e 50%,
#050d18 100%
);
font-family:
Inter,
system-ui,
-apple-system,
BlinkMacSystemFont,
"Segoe UI",
sans-serif;
}

.glow {
position: fixed;
width: 500px;
height: 500px;
border-radius: 50%;
filter: blur(140px);
pointer-events: none;
opacity: 0.14;
}

.glow1 {
background: #006dff;
top: -220px;
left: 20%;
}

.glow2 {
background: #00c8ff;
bottom: -250px;
right: -150px;
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
margin-bottom: 24px;
}

.eyebrow {
color: #32a8ff;
font-size: 11px;
font-weight: 900;
letter-spacing: 0.16em;
margin-bottom: 8px;
}

h1 {
margin: 0;
font-size: clamp(34px, 4vw, 58px);
line-height: 1;
letter-spacing: -0.04em;
}

.header p {
margin: 12px 0 0;
color: #86c8f7;
font-size: 14px;
}

.actions {
display: flex;
gap: 10px;
flex-wrap: wrap;
}

.button {
min-height: 44px;
padding: 0 18px;
border-radius: 12px;
border: 1px solid #1678ff;
font-size: 12px;
font-weight: 900;
cursor: pointer;
text-decoration: none;
display: inline-flex;
align-items: center;
justify-content: center;
}

.primary {
background: linear-gradient(
135deg,
#006cff,
#00a3ff
);
color: white;
}

.secondary {
background: rgba(9, 31, 55, 0.75);
color: #a1d9ff;
}

.statusBar {
min-height: 44px;
border: 1px solid rgba(45, 135, 255, 0.3);
background: rgba(8, 28, 50, 0.7);
border-radius: 13px;
padding: 0 15px;
display: flex;
align-items: center;
justify-content: space-between;
gap: 20px;
color: #80c9f8;
font-size: 10px;
font-weight: 900;
letter-spacing: 0.07em;
margin-bottom: 12px;
}

.liveDot {
display: inline-block;
width: 7px;
height: 7px;
background: #37ed94;
border-radius: 50%;
margin-right: 7px;
box-shadow: 0 0 13px #37ed94;
}

.error {
border: 1px solid rgba(255, 68, 102, 0.45);
background: rgba(255, 68, 102, 0.08);
color: #ffb6c5;
border-radius: 12px;
padding: 12px 15px;
margin-bottom: 12px;
font-size: 12px;
}

.metrics {
display: grid;
grid-template-columns: repeat(5, 1fr);
gap: 10px;
margin-bottom: 14px;
}

.layout {
display: grid;
grid-template-columns: minmax(0, 1fr) 320px;
gap: 14px;
}

.mainPanel,
.intelligence,
.horizon {
border: 1px solid rgba(47, 132, 255, 0.27);
background: rgba(7, 23, 42, 0.76);
backdrop-filter: blur(16px);
border-radius: 20px;
}

.mainPanel {
padding: 20px;
}

.sectionHeader {
display: flex;
align-items: flex-end;
justify-content: space-between;
gap: 20px;
margin-bottom: 15px;
}

.sectionHeader span {
color: #279fff;
font-size: 9px;
font-weight: 950;
letter-spacing: 0.14em;
}

.sectionHeader h2 {
margin: 5px 0 0;
font-size: 25px;
}

.live {
color: #63eeb0;
font-size: 9px;
font-weight: 900;
}

.trendGrid {
display: grid;
grid-template-columns: repeat(
2,
minmax(0, 1fr)
);
gap: 11px;
}

.trendCard {
border: 1px solid rgba(47, 132, 255, 0.25);
background:
linear-gradient(
145deg,
rgba(14, 43, 76, 0.86),
rgba(6, 23, 42, 0.94)
);
border-radius: 16px;
padding: 16px;
min-width: 0;
}

.trendCard:hover {
border-color: rgba(60, 160, 255, 0.6);
transform: translateY(-1px);
}

.trendTop {
display: flex;
align-items: center;
justify-content: space-between;
gap: 10px;
}

.trendNumber {
color: #4d9bd7;
font-size: 10px;
font-weight: 950;
}

.level {
border: 1px solid;
border-radius: 999px;
padding: 4px 8px;
font-size: 8px;
font-weight: 950;
letter-spacing: 0.08em;
}

.category {
color: #249fff;
font-size: 8px;
font-weight: 950;
letter-spacing: 0.13em;
margin-top: 14px;
}

.trendCard h3 {
margin: 5px 0 8px;
font-size: 17px;
}

.trendCard p {
min-height: 48px;
margin: 0 0 15px;
color: #91b2cb;
font-size: 10px;
line-height: 1.55;
}

.progressHeader {
display: flex;
justify-content: space-between;
color: #6794b7;
font-size: 8px;
margin-bottom: 6px;
}

.progressHeader strong {
color: #cbeaff;
}

.progress {
height: 4px;
background: rgba(100, 160, 210, 0.12);
border-radius: 999px;
overflow: hidden;
}

.progressValue {
height: 100%;
border-radius: 999px;
}

.trendFooter {
display: grid;
grid-template-columns: 1fr 1fr;
gap: 10px;
margin-top: 14px;
padding-top: 12px;
border-top: 1px solid rgba(70, 140, 200, 0.13);
}

.trendFooter span {
display: block;
color: #587e9c;
font-size: 8px;
margin-bottom: 3px;
}

.trendFooter strong {
color: #c9e8ff;
font-size: 9px;
overflow-wrap: anywhere;
}

.intelligence {
padding: 20px;
height: fit-content;
position: sticky;
top: 20px;
}

.radar {
width: 220px;
height: 220px;
border-radius: 50%;
margin: 5px auto 17px;
position: relative;
overflow: hidden;
border: 1px solid rgba(37, 155, 255, 0.45);
background:
radial-gradient(
circle,
rgba(0, 169, 255, 0.18),
rgba(0, 70, 130, 0.04) 57%,
transparent 72%
);
box-shadow:
inset 0 0 55px rgba(0, 124, 255, 0.15),
0 0 45px rgba(0, 105, 255, 0.08);
}

.orbit {
position: absolute;
border: 1px solid rgba(51, 163, 255, 0.24);
border-radius: 50%;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
}

.orbit1 {
width: 70px;
height: 70px;
}

.orbit2 {
width: 140px;
height: 140px;
}

.orbit3 {
width: 205px;
height: 205px;
}

.radarHorizontal,
.radarVertical {
position: absolute;
background: rgba(55, 162, 255, 0.16);
}

.radarHorizontal {
width: 100%;
height: 1px;
top: 50%;
}

.radarVertical {
width: 1px;
height: 100%;
left: 50%;
}

.sweep {
position: absolute;
width: 50%;
height: 50%;
left: 50%;
top: 0;
transform-origin: bottom left;
background: linear-gradient(
35deg,
rgba(0, 186, 255, 0.32),
transparent 70%
);
animation: scan 4s linear infinite;
}

@keyframes scan {
from {
transform: rotate(0deg);
}

to {
transform: rotate(360deg);
}
}

.core {
position: absolute;
width: 52px;
height: 52px;
border-radius: 50%;
left: calc(50% - 26px);
top: calc(50% - 26px);
display: flex;
align-items: center;
justify-content: center;
background:
radial-gradient(
circle,
#32d8ff,
#087cff 55%,
rgba(0, 94, 255, 0.25)
);
box-shadow: 0 0 35px rgba(38, 195, 255, 0.8);
font-weight: 950;
}

.signal {
position: absolute;
width: 7px;
height: 7px;
border-radius: 50%;
background: #54f5b3;
box-shadow: 0 0 14px #54f5b3;
}

.signal1 {
top: 30px;
left: 105px;
}

.signal2 {
right: 29px;
top: 130px;
}

.signal3 {
left: 37px;
bottom: 48px;
}

.coreTitle {
text-align: center;
color: #39aaff;
font-size: 9px;
font-weight: 950;
letter-spacing: 0.13em;
margin-bottom: 16px;
}

.coreTitle strong {
display: block;
color: white;
font-size: 20px;
margin-top: 4px;
letter-spacing: -0.02em;
}

.principal {
border: 1px solid rgba(52, 145, 255, 0.24);
background: rgba(14, 45, 77, 0.62);
border-radius: 13px;
padding: 13px;
margin-bottom: 10px;
}

.principal span {
color: #3faeff;
font-size: 8px;
font-weight: 950;
letter-spacing: 0.11em;
}

.principal strong {
display: block;
margin-top: 6px;
color: white;
font-size: 13px;
}

.principal p {
margin: 5px 0 0;
color: #7fa8c8;
font-size: 9px;
}

.note {
margin-top: 13px;
border: 1px solid rgba(49, 137, 238, 0.18);
background: rgba(15, 45, 76, 0.5);
border-radius: 12px;
padding: 12px;
color: #779dbb;
font-size: 9px;
line-height: 1.55;
}

.horizon {
margin-top: 14px;
padding: 20px;
}

.horizonGrid {
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 11px;
}

@media (max-width: 1100px) {
.metrics {
grid-template-columns: repeat(3, 1fr);
}

.layout {
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

.statusBar {
flex-direction: column;
align-items: flex-start;
padding: 12px 15px;
}

.metrics {
grid-template-columns: repeat(2, 1fr);
}

.trendGrid {
grid-template-columns: 1fr;
}

.horizonGrid {
grid-template-columns: 1fr;
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
}: {
label: string;
value: string;
detail: string;
}) {
return (
<div className="metric">
<span>{label}</span>
<strong>{value}</strong>
<small>{detail}</small>

<style jsx>{`
.metric {
min-height: 88px;
padding: 14px;
border-radius: 15px;
border: 1px solid rgba(48, 132, 255, 0.3);
background:
linear-gradient(
145deg,
rgba(18, 45, 77, 0.84),
rgba(9, 29, 51, 0.76)
);
}

span {
display: block;
color: #63b9f7;
font-size: 9px;
margin-bottom: 7px;
}

strong {
display: block;
color: white;
font-size: 23px;
line-height: 1;
}

small {
display: block;
margin-top: 7px;
color: #668ba7;
font-size: 8px;
}
`}</style>
</div>
);
}

function IntelRow({
label,
value,
}: {
label: string;
value: string;
}) {
return (
<div className="row">
<span>{label}</span>
<strong>{value}</strong>

<style jsx>{`
.row {
border-top: 1px solid rgba(53, 139, 230, 0.16);
padding: 12px 2px;
display: flex;
justify-content: space-between;
align-items: center;
gap: 15px;
}

span {
color: #769fbe;
font-size: 10px;
}

strong {
color: #d8efff;
font-size: 10px;
text-align: right;
}
`}</style>
</div>
);
}

function HorizonCard({
number,
title,
text,
}: {
number: string;
title: string;
text: string;
}) {
return (
<div className="horizonCard">
<span>{number}</span>
<h3>{title}</h3>
<p>{text}</p>

<style jsx>{`
.horizonCard {
border: 1px solid rgba(48, 132, 255, 0.23);
background: rgba(11, 36, 63, 0.62);
border-radius: 14px;
padding: 15px;
}

span {
color: #249fff;
font-size: 9px;
font-weight: 950;
}

h3 {
margin: 7px 0;
font-size: 15px;
}

p {
margin: 0;
color: #7fa5c2;
font-size: 10px;
line-height: 1.5;
}
`}</style>
</div>
);
}