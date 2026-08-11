"use client";

import { useEffect, useRef, useState } from "react";

export default function Dashboard() {
const [texto, setTexto] = useState("");
const [resposta, setResposta] = useState(
"NeuroTwin operacional. Aguardando comando estratégico."
);
const [observatorio, setObservatorio] = useState<any>(null);
const recognitionRef = useRef<any>(null);

useEffect(() => {
fetch("/api/observatorio")
.then((res) => {
if (!res.ok) {
throw new Error(`Observatório HTTP ${res.status}`);
}
return res.json();
})
.then((data) => {
setObservatorio(data);
})
.catch((error) => {
console.error("Erro ao carregar observatório:", error);
setObservatorio(null);
});

const SpeechRecognition =
(window as any).SpeechRecognition ||
(window as any).webkitSpeechRecognition;

if (!SpeechRecognition) {
setResposta(
"Reconhecimento de voz indisponível neste navegador."
);
return;
}

const recognition = new SpeechRecognition();

recognition.lang = "pt-BR";
recognition.continuous = false;
recognition.interimResults = false;

recognition.onresult = async (event: any) => {
const frase =
event.results?.[0]?.[0]?.transcript || "";

if (!frase) {
setResposta("Nenhum comando de voz identificado.");
return;
}

setTexto(frase);
setResposta("Analisando comando...");

try {
const r = await fetch("/api/chat", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
message: frase,
}),
});

if (!r.ok) {
throw new Error(`Chat HTTP ${r.status}`);
}

const data = await r.json();

const reply =
data.reply ||
data.resposta ||
"Resposta não encontrada.";

setResposta(reply);

if ("speechSynthesis" in window) {
const voz = new SpeechSynthesisUtterance(reply);

voz.lang = "pt-BR";

window.speechSynthesis.cancel();
window.speechSynthesis.speak(voz);
}
} catch (error) {
console.error("Erro NeuroTwin:", error);
setResposta(
"Falha ao consultar o núcleo operacional."
);
}
};

recognitionRef.current = recognition;

return () => {
try {
recognition.stop();
} catch {
// Nenhuma ação necessária.
}
};
}, []);

function ouvir() {
try {
recognitionRef.current?.start();
} catch {
setResposta(
"Não foi possível iniciar o reconhecimento de voz."
);
}
}

const paisesMonitorados =
observatorio?.paisesMonitorados ??
observatorio?.resumo?.paisesMonitorados ??
0;

const alertasAtivos =
observatorio?.alertas?.length ??
observatorio?.resumo?.alertasAtivos ??
0;

const modulosAtivos =
observatorio?.modulos?.length ??
3;

const statusGlobal =
observatorio
? "Online"
: "Carregando";

return (
<main style={styles.page}>
<aside style={styles.sidebar}>
<h1 style={styles.logo}>NeuroTwin 2050</h1>

<p style={styles.subtitle}>
Centro de Operações Estratégicas
</p>

<nav style={styles.nav}>
<a style={styles.link} href="/dashboard">
Centro Cognitivo
</a>

<a
style={styles.link}
href="/dashboard/observatorio"
>
Observatório Global
</a>

<a
style={styles.link}
href="/dashboard/relatorios"
>
Relatórios Executivos
</a>

<a
style={styles.link}
href="/dashboard/tendencias"
>
Tendências
</a>

<a
style={styles.link}
href="/dashboard/oportunidades"
>
Oportunidades
</a>

<a
style={styles.link}
href="/dashboard/alertas"
>
Alertas Críticos
</a>

<a
style={styles.link}
href="/dashboard/neurobot"
>
NeuroBot
</a>
</nav>
</aside>

<section style={styles.center}>
<h2 style={styles.title}>
Painel Operacional
</h2>

<p style={styles.desc}>
Monitoramento, análise, previsão e decisão
assistida por IA.
</p>

<div style={styles.avatarBox}>
<img
src="/avatar-neuro.png"
alt="NeuroTwin"
style={styles.avatar}
/>
</div>

<button
onClick={ouvir}
style={styles.button}
>
Comando de Voz
</button>

<div style={styles.responseBox}>
<p style={styles.label}>
Comando recebido:
</p>

<p style={styles.command}>
{texto || "Aguardando comando..."}
</p>

<p style={styles.label}>
Análise NeuroTwin:
</p>

<p style={styles.answer}>
{resposta}
</p>
</div>
</section>

<aside style={styles.rightPanel}>
<Card
title="Status Global"
value={statusGlobal}
/>

<Card
title="Países Monitorados"
value={String(paisesMonitorados)}
/>

<Card
title="Alertas Ativos"
value={String(alertasAtivos)}
/>

<Card
title="Módulos Ativos"
value={String(modulosAtivos)}
/>

<Card
title="Relatórios"
value="Prontos para emissão"
/>
</aside>
</main>
);
}

function Card({
title,
value,
}: {
title: string;
value: string;
}) {
return (
<div style={styles.card}>
<span style={styles.cardTitle}>
{title}
</span>

<strong style={styles.cardValue}>
{value}
</strong>
</div>
);
}

const styles: Record<string, React.CSSProperties> = {
page: {
minHeight: "100vh",
display: "grid",
gridTemplateColumns: "250px 1fr 280px",
background:
"radial-gradient(circle at center, #05235f 0%, #020817 48%, #01030a 100%)",
color: "#ffffff",
fontFamily: "Arial, Helvetica, sans-serif",
},

sidebar: {
padding: "35px 24px",
borderRight: "1px solid rgba(255,255,255,0.12)",
background: "rgba(2,8,23,0.85)",
},

logo: {
margin: 0,
fontSize: "27px",
fontWeight: 800,
},

subtitle: {
marginTop: "8px",
marginBottom: "35px",
color: "#6ea8ff",
fontSize: "14px",
},

nav: {
display: "flex",
flexDirection: "column",
gap: "10px",
},

link: {
color: "#ffffff",
textDecoration: "none",
padding: "12px 10px",
borderRadius: "8px",
fontSize: "15px",
background: "rgba(255,255,255,0.02)",
},

center: {
display: "flex",
flexDirection: "column",
alignItems: "center",
padding: "50px 35px",
textAlign: "center",
},

title: {
fontSize: "42px",
margin: "0 0 5px",
},

desc: {
color: "#7db2ff",
marginBottom: "30px",
},

avatarBox: {
width: "340px",
height: "340px",
borderRadius: "50%",
display: "flex",
justifyContent: "center",
alignItems: "center",
background:
"radial-gradient(circle, #0a3b8c 0%, #031535 60%, #010713 100%)",
boxShadow:
"0 0 30px #006dff, 0 0 90px rgba(0,109,255,0.55)",
overflow: "hidden",
},

avatar: {
width: "100%",
height: "100%",
objectFit: "cover",
borderRadius: "50%",
},

button: {
marginTop: "30px",
padding: "14px 30px",
border: "1px solid #247cff",
borderRadius: "12px",
background: "#0754c7",
color: "#ffffff",
fontWeight: 700,
cursor: "pointer",
fontSize: "15px",
},

responseBox: {
width: "100%",
maxWidth: "700px",
marginTop: "30px",
padding: "20px",
border: "1px solid rgba(77,150,255,0.35)",
borderRadius: "14px",
background: "rgba(0,20,60,0.55)",
textAlign: "left",
},

label: {
color: "#73aaff",
fontSize: "13px",
marginBottom: "5px",
},

command: {
marginTop: 0,
marginBottom: "20px",
color: "#ffffff",
},

answer: {
marginTop: 0,
color: "#ffffff",
lineHeight: 1.6,
},

rightPanel: {
padding: "35px 20px",
borderLeft: "1px solid rgba(255,255,255,0.12)",
display: "flex",
flexDirection: "column",
gap: "15px",
background: "rgba(2,8,23,0.55)",
},

card: {
minHeight: "80px",
padding: "16px",
borderRadius: "12px",
border: "1px solid rgba(80,150,255,0.35)",
background: "rgba(7,30,75,0.6)",
display: "flex",
flexDirection: "column",
justifyContent: "center",
},

cardTitle: {
color: "#9fc3ff",
fontSize: "13px",
marginBottom: "7px",
},

cardValue: {
color: "#ffffff",
fontSize: "16px",
},
};

