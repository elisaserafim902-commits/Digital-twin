"use client";

import { useState } from "react";

type Status = "pronto" | "analisando" | "erro";

export default function NeuroBotPage() {
const [pergunta, setPergunta] = useState("");
const [resposta, setResposta] = useState("");
const [status, setStatus] = useState<Status>("pronto");

async function analisar() {
const mensagem = pergunta.trim();

if (!mensagem || status === "analisando") return;

setStatus("analisando");
setResposta("");

try {
const respostaApi = await fetch("/api/chat", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
message: mensagem,
}),
});

if (!respostaApi.ok) {
throw new Error(`HTTP ${respostaApi.status}`);
}

const data = await respostaApi.json();

const texto =
typeof data?.answer === "string"
? data.answer
: typeof data?.response === "string"
? data.response
: typeof data?.message === "string"
? data.message
: "A análise foi concluída, mas a API não retornou uma resposta textual.";

setResposta(texto);
setStatus("pronto");
} catch (error) {
console.error("Erro NeuroBot:", error);

setResposta(
"Não foi possível concluir a análise neste momento. Verifique a conexão com o núcleo de inteligência e tente novamente."
);

setStatus("erro");
}
}

function limpar() {
setPergunta("");
setResposta("");
setStatus("pronto");
}

function usarComando(comando: string) {
setPergunta(comando);
setResposta("");
setStatus("pronto");
}

return (
<main style={styles.page}>
<header style={styles.header}>
<div>
<div style={styles.eyebrow}>
NEUROTWIN 2050 • INTELLIGENCE INTERFACE
</div>

<h1 style={styles.title}>NeuroBot</h1>

<p style={styles.subtitle}>
Interface estratégica de inteligência do ecossistema NeuroTwin.
</p>
</div>

<div style={styles.statusBox}>
<span
style={{
...styles.statusDot,
background:
status === "erro"
? "#fb7185"
: status === "analisando"
? "#facc15"
: "#22c55e",
}}
/>

{status === "analisando"
? "PROCESSANDO"
: status === "erro"
? "ATENÇÃO"
: "NÚCLEO ONLINE"}
</div>
</header>

<section style={styles.architecture}>
<div style={styles.architectureHeader}>
<div>
<span style={styles.sectionLabel}>ARQUITETURA OPERACIONAL</span>
<h2 style={styles.sectionTitle}>Inteligência conectada</h2>
</div>

<span style={styles.independent}>
OPERAÇÃO INDEPENDENTE
</span>
</div>

<p style={styles.architectureText}>
O NeuroBot atua como interface de análise e interação do NeuroTwin.
Observatório, Tendências, Oportunidades e Relatórios permanecem como
operações especializadas e independentes, conectadas pelo mesmo
ecossistema de inteligência.
</p>

<div style={styles.nodes}>
<Node
code="OBS"
title="Observatório"
description="Sinais e eventos globais"
/>

<Node
code="TEN"
title="Tendências"
description="Mudanças e sinais emergentes"
/>

<Node
code="OPR"
title="Oportunidades"
description="Potenciais estratégicos"
/>

<Node
code="REL"
title="Relatórios"
description="Síntese executiva"
/>

<Node
code="BOT"
title="NeuroBot"
description="Interface de inteligência"
active
/>
</div>
</section>

<section style={styles.workspace}>
<div style={styles.console}>
<div style={styles.consoleHeader}>
<div>
<span style={styles.sectionLabel}>NEUROBOT CORE</span>
<h2 style={styles.consoleTitle}>
Central de Inteligência
</h2>
</div>

<div style={styles.live}>
<span style={styles.liveDot} />
LIVE
</div>
</div>

<p style={styles.description}>
Envie uma pergunta, solicite uma análise ou peça uma síntese
estratégica ao núcleo NeuroBot.
</p>

<div style={styles.quickCommands}>
<button
type="button"
style={styles.quickButton}
onClick={() =>
usarComando(
"Analise os principais sinais estratégicos disponíveis no NeuroTwin."
)
}
>
Análise estratégica
</button>

<button
type="button"
style={styles.quickButton}
onClick={() =>
usarComando(
"Gere uma síntese executiva das informações mais relevantes."
)
}
>
Síntese executiva
</button>

<button
type="button"
style={styles.quickButton}
onClick={() =>
usarComando(
"Identifique riscos, oportunidades e pontos que exigem atenção."
)
}
>
Riscos e oportunidades
</button>
</div>

<textarea
value={pergunta}
onChange={(event) => setPergunta(event.target.value)}
placeholder="Digite sua solicitação para o NeuroBot..."
style={styles.textarea}
rows={7}
onKeyDown={(event) => {
if (
event.key === "Enter" &&
(event.ctrlKey || event.metaKey)
) {
event.preventDefault();
analisar();
}
}}
/>

<div style={styles.actions}>
<button
type="button"
onClick={analisar}
disabled={
!pergunta.trim() || status === "analisando"
}
style={{
...styles.primaryButton,
opacity:
!pergunta.trim() || status === "analisando"
? 0.55
: 1,
cursor:
!pergunta.trim() || status === "analisando"
? "not-allowed"
: "pointer",
}}
>
{status === "analisando"
? "Processando análise..."
: "Executar análise"}
</button>

<button
type="button"
onClick={limpar}
style={styles.secondaryButton}
>
Limpar
</button>
</div>

<div style={styles.hint}>
CTRL + ENTER para executar
</div>
</div>

<aside style={styles.sidePanel}>
<span style={styles.sectionLabel}>
STATUS OPERACIONAL
</span>

<h2 style={styles.sideTitle}>NeuroBot Core</h2>

<div style={styles.core}>
<div style={styles.orbit3}>
<div style={styles.orbit2}>
<div style={styles.orbit1}>
<div style={styles.coreCenter}>NB</div>
</div>
</div>
</div>
</div>

<Metric
label="Interface"
value="Ativa"
/>

<Metric
label="Canal"
value="/api/chat"
/>

<Metric
label="Operação"
value="Independente"
/>

<Metric
label="Ecossistema"
value="NeuroTwin 2050"
/>
</aside>
</section>

{resposta && (
<section style={styles.responsePanel}>
<div style={styles.responseHeader}>
<div>
<span style={styles.sectionLabel}>
INTELLIGENCE OUTPUT
</span>

<h2 style={styles.responseTitle}>
Resposta NeuroBot
</h2>
</div>

<span
style={{
...styles.responseStatus,
color:
status === "erro"
? "#fb7185"
: "#86efac",
}}
>
{status === "erro"
? "FALHA OPERACIONAL"
: "ANÁLISE CONCLUÍDA"}
</span>
</div>

<pre style={styles.responseText}>
{resposta}
</pre>
</section>
)}

<footer style={styles.footer}>
<span>
NEUROTWIN 2050
</span>

<span>
NeuroBot • Strategic Intelligence Interface
</span>
</footer>
</main>
);
}

function Node({
code,
title,
description,
active = false,
}: {
code: string;
title: string;
description: string;
active?: boolean;
}) {
return (
<div
style={{
...styles.node,
...(active ? styles.nodeActive : {}),
}}
>
<div
style={{
...styles.nodeCode,
...(active ? styles.nodeCodeActive : {}),
}}
>
{code}
</div>

<div>
<strong style={styles.nodeTitle}>
{title}
</strong>

<span style={styles.nodeDescription}>
{description}
</span>
</div>
</div>
);
}

function Metric({
label,
value,
}: {
label: string;
value: string;
}) {
return (
<div style={styles.metric}>
<span style={styles.metricLabel}>
{label}
</span>

<strong style={styles.metricValue}>
{value}
</strong>
</div>
);
}

const styles: Record<string, React.CSSProperties> = {
page: {
minHeight: "100vh",
padding: "34px",
color: "#f8fafc",
fontFamily:
"Arial, Helvetica, sans-serif",
background:
"radial-gradient(circle at 50% 0%, rgba(0,119,255,.22), transparent 34%), radial-gradient(circle at 90% 30%, rgba(0,213,255,.10), transparent 30%), #020617",
},

header: {
display: "flex",
justifyContent: "space-between",
alignItems: "flex-start",
gap: "24px",
paddingBottom: "26px",
borderBottom:
"1px solid rgba(56,189,248,.20)",
},

eyebrow: {
color: "#38bdf8",
fontSize: "11px",
fontWeight: 800,
letterSpacing: "2px",
},

title: {
margin: "10px 0 6px",
fontSize: "48px",
lineHeight: 1,
letterSpacing: "-2px",
},

subtitle: {
margin: 0,
color: "#94a3b8",
fontSize: "15px",
},

statusBox: {
display: "flex",
alignItems: "center",
gap: "9px",
padding: "11px 15px",
borderRadius: "999px",
border:
"1px solid rgba(56,189,248,.25)",
background:
"rgba(15,23,42,.78)",
color: "#cbd5e1",
fontSize: "11px",
fontWeight: 800,
letterSpacing: "1px",
},

statusDot: {
width: "8px",
height: "8px",
borderRadius: "50%",
boxShadow:
"0 0 14px currentColor",
},

architecture: {
marginTop: "24px",
padding: "24px",
border:
"1px solid rgba(56,189,248,.20)",
borderRadius: "22px",
background:
"linear-gradient(135deg, rgba(15,23,42,.92), rgba(2,6,23,.90))",
},

architectureHeader: {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
gap: "20px",
},

sectionLabel: {
color: "#38bdf8",
fontSize: "10px",
fontWeight: 800,
letterSpacing: "1.7px",
},

sectionTitle: {
margin: "7px 0 0",
fontSize: "22px",
},

independent: {
padding: "8px 11px",
borderRadius: "999px",
background:
"rgba(34,197,94,.08)",
border:
"1px solid rgba(34,197,94,.25)",
color: "#86efac",
fontSize: "10px",
fontWeight: 800,
letterSpacing: "1px",
},

architectureText: {
maxWidth: "900px",
margin: "16px 0 22px",
color: "#94a3b8",
lineHeight: 1.7,
fontSize: "14px",
},

nodes: {
display: "grid",
gridTemplateColumns:
"repeat(auto-fit, minmax(170px, 1fr))",
gap: "12px",
},

node: {
display: "flex",
alignItems: "center",
gap: "12px",
minHeight: "72px",
padding: "13px",
borderRadius: "15px",
border:
"1px solid rgba(148,163,184,.12)",
background:
"rgba(2,6,23,.65)",
},

nodeActive: {
border:
"1px solid rgba(0,213,255,.55)",
boxShadow:
"0 0 25px rgba(0,213,255,.10)",
},

nodeCode: {
width: "39px",
height: "39px",
display: "grid",
placeItems: "center",
flexShrink: 0,
borderRadius: "11px",
background:
"rgba(30,41,59,.85)",
color: "#94a3b8",
fontSize: "10px",
fontWeight: 900,
},

nodeCodeActive: {
background:
"rgba(0,213,255,.12)",
color: "#67e8f9",
},

nodeTitle: {
display: "block",
color: "#e2e8f0",
fontSize: "13px",
},

nodeDescription: {
display: "block",
marginTop: "4px",
color: "#64748b",
fontSize: "11px",
lineHeight: 1.4,
},

workspace: {
display: "grid",
gridTemplateColumns:
"minmax(0, 1fr) 300px",
gap: "20px",
marginTop: "20px",
},

console: {
padding: "26px",
borderRadius: "22px",
border:
"1px solid rgba(56,189,248,.24)",
background:
"rgba(15,23,42,.88)",
boxShadow:
"0 20px 80px rgba(0,0,0,.20)",
},

consoleHeader: {
display: "flex",
justifyContent: "space-between",
alignItems: "flex-start",
gap: "20px",
},

consoleTitle: {
margin: "7px 0 0",
fontSize: "27px",
},

live: {
display: "flex",
alignItems: "center",
gap: "7px",
color: "#86efac",
fontSize: "10px",
fontWeight: 900,
},

liveDot: {
width: "7px",
height: "7px",
borderRadius: "50%",
background: "#22c55e",
boxShadow:
"0 0 12px #22c55e",
},

description: {
margin: "13px 0 18px",
color: "#94a3b8",
fontSize: "14px",
lineHeight: 1.6,
},

quickCommands: {
display: "flex",
flexWrap: "wrap",
gap: "9px",
marginBottom: "15px",
},

quickButton: {
padding: "9px 12px",
borderRadius: "10px",
border:
"1px solid rgba(56,189,248,.18)",
background:
"rgba(2,6,23,.70)",
color: "#bae6fd",
cursor: "pointer",
fontSize: "11px",
},

textarea: {
width: "100%",
boxSizing: "border-box",
resize: "vertical",
minHeight: "165px",
padding: "18px",
borderRadius: "16px",
outline: "none",
border:
"1px solid rgba(56,189,248,.24)",
background:
"rgba(2,6,23,.86)",
color: "#f8fafc",
fontFamily:
"Arial, Helvetica, sans-serif",
fontSize: "15px",
lineHeight: 1.6,
},

actions: {
display: "flex",
gap: "10px",
marginTop: "14px",
},

primaryButton: {
padding: "12px 20px",
border: "none",
borderRadius: "12px",
background:
"linear-gradient(135deg, #0284c7, #2563eb)",
color: "#fff",
fontWeight: 800,
boxShadow:
"0 10px 30px rgba(37,99,235,.20)",
},

secondaryButton: {
padding: "12px 18px",
borderRadius: "12px",
border:
"1px solid rgba(148,163,184,.20)",
background:
"rgba(30,41,59,.55)",
color: "#cbd5e1",
cursor: "pointer",
fontWeight: 700,
},

hint: {
marginTop: "12px",
color: "#475569",
fontSize: "10px",
letterSpacing: ".7px",
},

sidePanel: {
padding: "24px",
borderRadius: "22px",
border:
"1px solid rgba(56,189,248,.20)",
background:
"rgba(15,23,42,.82)",
},

sideTitle: {
margin: "7px 0 0",
fontSize: "22px",
},

core: {
minHeight: "210px",
display: "grid",
placeItems: "center",
},

orbit3: {
width: "165px",
height: "165px",
display: "grid",
placeItems: "center",
borderRadius: "50%",
border:
"1px solid rgba(56,189,248,.14)",
},

orbit2: {
width: "120px",
height: "120px",
display: "grid",
placeItems: "center",
borderRadius: "50%",
border:
"1px solid rgba(56,189,248,.25)",
},

orbit1: {
width: "78px",
height: "78px",
display: "grid",
placeItems: "center",
borderRadius: "50%",
border:
"1px solid rgba(103,232,249,.45)",
boxShadow:
"0 0 35px rgba(0,213,255,.16)",
},

coreCenter: {
width: "52px",
height: "52px",
display: "grid",
placeItems: "center",
borderRadius: "50%",
background:
"radial-gradient(circle, #22d3ee, #0369a1 55%, #082f49)",
color: "#fff",
fontSize: "16px",
fontWeight: 900,
boxShadow:
"0 0 30px rgba(34,211,238,.55)",
},

metric: {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
gap: "12px",
padding: "12px 0",
borderTop:
"1px solid rgba(148,163,184,.10)",
},

metricLabel: {
color: "#64748b",
fontSize: "11px",
},

metricValue: {
color: "#e2e8f0",
fontSize: "11px",
textAlign: "right",
},

responsePanel: {
marginTop: "20px",
padding: "26px",
borderRadius: "22px",
border:
"1px solid rgba(34,211,238,.25)",
background:
"linear-gradient(135deg, rgba(8,47,73,.42), rgba(15,23,42,.92))",
},

responseHeader: {
display: "flex",
justifyContent: "space-between",
alignItems: "flex-start",
gap: "20px",
marginBottom: "20px",
},

responseTitle: {
margin: "7px 0 0",
fontSize: "23px",
},

responseStatus: {
fontSize: "10px",
fontWeight: 900,
letterSpacing: "1px",
},

responseText: {
margin: 0,
padding: "20px",
whiteSpace: "pre-wrap",
overflowWrap: "anywhere",
borderRadius: "15px",
background:
"rgba(2,6,23,.75)",
border:
"1px solid rgba(148,163,184,.10)",
color: "#dbeafe",
fontFamily:
"Arial, Helvetica, sans-serif",
fontSize: "14px",
lineHeight: 1.75,
},

footer: {
display: "flex",
justifyContent: "space-between",
gap: "20px",
marginTop: "22px",
paddingTop: "18px",
borderTop:
"1px solid rgba(56,189,248,.12)",
color: "#475569",
fontSize: "10px",
letterSpacing: "1px",
},
};