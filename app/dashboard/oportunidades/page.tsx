"use client";

import { useEffect, useMemo, useState } from "react";

type ObservatorioData = {
earthquakes?: unknown[];
naturalEvents?: unknown[];
gdacsEvents?: unknown[];
};

type Oportunidade = {
id: string;
titulo: string;
descricao: string;
area: string;
nivel: "ALTA" | "MEDIA" | "ESTRATEGICA";
};

export default function OportunidadesPage() {
const [dados, setDados] = useState<ObservatorioData | null>(null);
const [carregando, setCarregando] = useState(true);
const [ultimaAtualizacao, setUltimaAtualizacao] = useState<Date | null>(null);

useEffect(() => {
let ativo = true;

async function carregar() {
try {
const resposta = await fetch("/api/observatorio", {
cache: "no-store",
});

if (!resposta.ok) {
throw new Error(`HTTP ${resposta.status}`);
}

const json = (await resposta.json()) as ObservatorioData;

if (ativo) {
setDados(json);
setUltimaAtualizacao(new Date());
}
} catch (erro) {
console.error("Erro ao carregar oportunidades:", erro);

if (ativo) {
setDados(null);
}
} finally {
if (ativo) {
setCarregando(false);
}
}
}

carregar();

const intervalo = window.setInterval(carregar, 60000);

return () => {
ativo = false;
window.clearInterval(intervalo);
};
}, []);

const terremotos = dados?.earthquakes?.length ?? 0;
const eventosNaturais = dados?.naturalEvents?.length ?? 0;
const eventosGdacs = dados?.gdacsEvents?.length ?? 0;

const totalSinais =
terremotos + eventosNaturais + eventosGdacs;

const oportunidades = useMemo<Oportunidade[]>(() => {
return [
{
id: "OP-001",
titulo: "Inteligência para Defesa Civil",
descricao:
"Transformar sinais sísmicos, ambientais e de desastres em apoio operacional para prevenção, monitoramento e resposta.",
area: "Gestão Pública",
nivel: "ALTA",
},
{
id: "OP-002",
titulo: "Observatório Municipal Inteligente",
descricao:
"Estrutura adaptável para municípios monitorarem riscos, eventos ambientais e indicadores estratégicos em um único núcleo.",
area: "Cidades Inteligentes",
nivel: "ESTRATEGICA",
},
{
id: "OP-003",
titulo: "Centro de Inteligência Regional",
descricao:
"Integração de diferentes fontes para apoiar decisões regionais com visão territorial e acompanhamento contínuo.",
area: "Governo",
nivel: "ALTA",
},
{
id: "OP-004",
titulo: "Relatórios Executivos Automatizados",
descricao:
"Conversão dos dados monitorados pelo NeuroTwin em sínteses operacionais para gestores e instituições.",
area: "Inteligência",
nivel: "ESTRATEGICA",
},
];
}, []);

return (
<main className="page">
<header className="header">
<div>
<div className="eyebrow">
NEUROTWIN 2050 • OPPORTUNITY INTELLIGENCE
</div>

<h1>Radar de Oportunidades</h1>

<p className="subtitle">
Identificação de aplicações, projetos e possibilidades
estratégicas a partir da inteligência integrada do NeuroTwin.
</p>
</div>

<a href="/dashboard" className="back">
← Painel Operacional
</a>
</header>

<section className="statusBar">
<span className="liveDot" />
MOTOR DE OPORTUNIDADES OPERACIONAL

<span className="update">
{ultimaAtualizacao
? `Última análise: ${ultimaAtualizacao.toLocaleTimeString(
"pt-BR"
)}`
: "Sincronizando inteligência..."}
</span>
</section>

<section className="metrics">
<Metric
label="Sinais analisados"
value={carregando ? "..." : totalSinais}
detail="dados do Observatório"
/>

<Metric
label="Terremotos"
value={carregando ? "..." : terremotos}
detail="sinais sísmicos"
/>

<Metric
label="Eventos ambientais"
value={carregando ? "..." : eventosNaturais}
detail="monitoramento ambiental"
/>

<Metric
label="GDACS"
value={carregando ? "..." : eventosGdacs}
detail="eventos globais"
/>
</section>

<section className="intelligence">
<div>
<div className="sectionLabel">OPPORTUNITY ENGINE</div>
<h2>Inteligência de Oportunidades</h2>

<p>
Este núcleo não substitui o Observatório Global. Ele utiliza
os sinais produzidos pelo ecossistema NeuroTwin para identificar
onde esses dados podem gerar aplicações, projetos e valor
operacional.
</p>
</div>

<div className="core">
<div className="coreRing">
<div className="coreCenter">NT</div>
</div>

<strong>Opportunity Core</strong>
<span>ANÁLISE CONTÍNUA</span>
</div>
</section>

<section className="opportunities">
<div className="sectionHeader">
<div>
<div className="sectionLabel">STRATEGIC RADAR</div>
<h2>Oportunidades Detectadas</h2>
</div>

<div className="counter">
{oportunidades.length} frentes estratégicas
</div>
</div>

<div className="grid">
{oportunidades.map((item) => (
<article className="card" key={item.id}>
<div className="cardTop">
<span className="id">{item.id}</span>

<span
className={`level ${item.nivel.toLowerCase()}`}
>
{item.nivel}
</span>
</div>

<h3>{item.titulo}</h3>

<p>{item.descricao}</p>

<div className="cardFooter">
<span>{item.area}</span>
<span>NeuroTwin 2050</span>
</div>
</article>
))}
</div>
</section>

<section className="integration">
<div>
<div className="sectionLabel">INTEGRATED ECOSYSTEM</div>
<h2>Operações independentes. Inteligência conectada.</h2>
</div>

<p>
Observatório Global → Centro Cognitivo → Tendências →
Oportunidades → Relatórios Executivos. Cada operação mantém
sua própria função e arquitetura, enquanto compartilha sinais
estratégicos com o ecossistema NeuroTwin.
</p>
</section>

<style jsx>{`
* {
box-sizing: border-box;
}

.page {
min-height: 100vh;
padding: 34px;
color: #f8fbff;
font-family: Arial, Helvetica, sans-serif;
background:
radial-gradient(
circle at 50% 0%,
rgba(0, 115, 255, 0.22),
transparent 38%
),
radial-gradient(
circle at 100% 40%,
rgba(0, 213, 255, 0.08),
transparent 35%
),
#020617;
}

.header {
display: flex;
align-items: flex-start;
justify-content: space-between;
gap: 24px;
max-width: 1500px;
margin: 0 auto;
}

.eyebrow,
.sectionLabel {
color: #38bdf8;
font-size: 11px;
font-weight: 800;
letter-spacing: 2px;
}

h1 {
margin: 9px 0 8px;
font-size: clamp(36px, 5vw, 66px);
line-height: 0.95;
letter-spacing: -2px;
}

.subtitle {
max-width: 850px;
color: #9eb5ca;
line-height: 1.6;
}

.back {
color: white;
text-decoration: none;
padding: 13px 18px;
border: 1px solid rgba(56, 189, 248, 0.35);
border-radius: 12px;
background: rgba(15, 23, 42, 0.7);
}

.statusBar {
position: relative;
max-width: 1500px;
margin: 28px auto 0;
padding: 13px 16px;
border: 1px solid rgba(56, 189, 248, 0.3);
border-radius: 13px;
background: rgba(15, 23, 42, 0.7);
color: #7dd3fc;
font-size: 11px;
font-weight: 800;
letter-spacing: 1px;
}

.liveDot {
display: inline-block;
width: 8px;
height: 8px;
margin-right: 9px;
border-radius: 50%;
background: #22c55e;
box-shadow: 0 0 14px #22c55e;
}

.update {
float: right;
color: #7890a6;
font-weight: 600;
letter-spacing: 0;
}

.metrics {
max-width: 1500px;
margin: 14px auto 0;
display: grid;
grid-template-columns: repeat(4, 1fr);
gap: 12px;
}

.metric {
padding: 20px;
border: 1px solid rgba(56, 189, 248, 0.25);
border-radius: 18px;
background: rgba(15, 23, 42, 0.74);
}

.metricLabel {
display: block;
color: #7dd3fc;
font-size: 11px;
}

.metricValue {
display: block;
margin-top: 10px;
font-size: 31px;
font-weight: 900;
}

.metricDetail {
display: block;
margin-top: 5px;
color: #71859a;
font-size: 11px;
}

.intelligence {
max-width: 1500px;
margin: 16px auto 0;
padding: 28px;
display: grid;
grid-template-columns: 1fr 270px;
gap: 30px;
align-items: center;
border: 1px solid rgba(56, 189, 248, 0.25);
border-radius: 22px;
background:
linear-gradient(
135deg,
rgba(15, 23, 42, 0.94),
rgba(8, 47, 73, 0.72)
);
}

.intelligence h2,
.opportunities h2,
.integration h2 {
margin: 8px 0 10px;
font-size: 27px;
}

.intelligence p,
.integration p {
color: #94a8ba;
line-height: 1.7;
max-width: 900px;
}

.core {
text-align: center;
}

.coreRing {
width: 130px;
height: 130px;
margin: 0 auto 14px;
border: 1px solid rgba(56, 189, 248, 0.35);
border-radius: 50%;
display: grid;
place-items: center;
box-shadow:
0 0 50px rgba(0, 213, 255, 0.15),
inset 0 0 35px rgba(0, 213, 255, 0.08);
}

.coreCenter {
width: 70px;
height: 70px;
display: grid;
place-items: center;
border-radius: 50%;
font-weight: 900;
background: #0ea5e9;
box-shadow: 0 0 30px #0ea5e9;
}

.core strong,
.core span {
display: block;
}

.core span {
margin-top: 6px;
color: #38bdf8;
font-size: 10px;
letter-spacing: 1px;
}

.opportunities {
max-width: 1500px;
margin: 16px auto 0;
padding: 28px;
border: 1px solid rgba(56, 189, 248, 0.2);
border-radius: 22px;
background: rgba(15, 23, 42, 0.66);
}

.sectionHeader {
display: flex;
justify-content: space-between;
align-items: center;
gap: 20px;
}

.counter {
padding: 10px 14px;
color: #7dd3fc;
border: 1px solid rgba(56, 189, 248, 0.25);
border-radius: 999px;
font-size: 12px;
}

.grid {
display: grid;
grid-template-columns: repeat(2, 1fr);
gap: 14px;
margin-top: 20px;
}

.card {
padding: 22px;
min-height: 220px;
border: 1px solid rgba(56, 189, 248, 0.2);
border-radius: 18px;
background:
linear-gradient(
145deg,
rgba(15, 23, 42, 0.95),
rgba(8, 47, 73, 0.35)
);
}

.cardTop,
.cardFooter {
display: flex;
justify-content: space-between;
align-items: center;
gap: 15px;
}

.id {
color: #38bdf8;
font-size: 11px;
font-weight: 800;
}

.level {
padding: 6px 9px;
border-radius: 999px;
font-size: 9px;
font-weight: 900;
}

.alta {
color: #fde68a;
background: rgba(245, 158, 11, 0.13);
border: 1px solid rgba(245, 158, 11, 0.35);
}

.media {
color: #7dd3fc;
background: rgba(14, 165, 233, 0.13);
border: 1px solid rgba(14, 165, 233, 0.35);
}

.estrategica {
color: #c4b5fd;
background: rgba(139, 92, 246, 0.13);
border: 1px solid rgba(139, 92, 246, 0.35);
}

.card h3 {
margin: 18px 0 9px;
font-size: 21px;
}

.card p {
color: #91a6b9;
line-height: 1.6;
min-height: 75px;
}

.cardFooter {
margin-top: 20px;
padding-top: 14px;
border-top: 1px solid rgba(148, 163, 184, 0.12);
color: #60778b;
font-size: 10px;
text-transform: uppercase;
letter-spacing: 1px;
}

.integration {
max-width: 1500px;
margin: 16px auto 40px;
padding: 28px;
display: grid;
grid-template-columns: 1fr 1.4fr;
gap: 30px;
border: 1px solid rgba(56, 189, 248, 0.2);
border-radius: 22px;
background: rgba(2, 6, 23, 0.72);
}

@media (max-width: 900px) {
.page {
padding: 20px;
}

.header,
.sectionHeader {
flex-direction: column;
align-items: flex-start;
}

.metrics,
.grid,
.intelligence,
.integration {
grid-template-columns: 1fr;
}

.update {
float: none;
display: block;
margin-top: 7px;
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
value: string | number;
detail: string;
}) {
return (
<div className="metric">
<span className="metricLabel">{label}</span>
<strong className="metricValue">{value}</strong>
<span className="metricDetail">{detail}</span>
</div>
);
}