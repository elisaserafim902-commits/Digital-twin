"use client";

import { useEffect, useRef, useState } from "react";

export default function Dashboard() {
const [texto, setTexto] = useState("");
const [resposta, setResposta] = useState("NeuroTwin operacional. Aguardando comando estratégico.");
const [observatorio, setObservatorio] = useState<any>(null);
const recognitionRef = useRef<any>(null);

useEffect(() => {
fetch("/api/observatorio")
.then((res) => res.json())
.then((data) => setObservatorio(data))
.catch(() => setObservatorio(null));

const SpeechRecognition =
(window as any).SpeechRecognition ||
(window as any).webkitSpeechRecognition;

if (!SpeechRecognition) {
setResposta("Reconhecimento de voz indisponível neste navegador.");
return;
}

const recognition = new SpeechRecognition();
recognition.lang = "pt-BR";
recognition.continuous = false;
recognition.interimResults = false;

recognition.onresult = async (event: any) => {
const frase = event.results[0][0].transcript;
setTexto(frase);
setResposta("Analisando comando...");

try {
const r = await fetch("/api/chat", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ message: frase }),
});

const data = await r.json();
const reply = data.reply || "Resposta não encontrada.";

setResposta(reply);

const voz = new SpeechSynthesisUtterance(reply);
voz.lang = "pt-BR";
window.speechSynthesis.cancel();
window.speechSynthesis.speak(voz);
} catch {
setResposta("Falha ao consultar o núcleo operacional.");
}
};

recognitionRef.current = recognition;
}, []);

function ouvir() {
recognitionRef.current?.start();
}

return (
<main style={styles.page}>
<aside style={styles.sidebar}>
<h1 style={styles.logo}>NeuroTwin 2050</h1>
<p style={styles.subtitle}>Centro de Operações Estratégicas</p>

<nav style={styles.nav}>
<span>🧠 Centro Cognitivo</span>
<span>🌎 Observatório Global</span>
<span>⚠️ Alertas Críticos</span>
<span>📈 Tendências</span>
<span>💼 Oportunidades</span>
<span>📄 Relatórios</span>
<span>🤖 NeuroBot</span>
</nav>
</aside>

<section style={styles.center}>
<h2 style={styles.title}>Painel Operacional</h2>
<p style={styles.desc}>Monitoramento, análise, previsão e decisão assistida por IA.</p>

<div style={styles.avatarBox}>
<img src="/avatar-neuro.png" alt="NeuroTwin" style={styles.avatar} />
</div>

<button onClick={ouvir} style={styles.button}>🎙 Comando de Voz</button>

<div style={styles.responseBox}>
<p style={styles.label}>Comando recebido:</p>
<p style={styles.command}>{texto || "Aguardando comando..."}</p>

<p style={styles.label}>Análise NeuroTwin:</p>
<p style={styles.answer}>{resposta}</p>
</div>
</section>

<aside style={styles.rightPanel}>
<Card title="Status Global" value={observatorio?.status || "Carregando"} />
<Card title="Países Monitorados" value={`${observatorio?.paisesMonitorados || 0}`} />
<Card title="Alertas Ativos" value={`${observatorio?.alertas?.length || 0}`} />
<Card title="Módulos Ativos" value={`${observatorio?.modulos?.length || 0}`} />
<Card title="Relatórios" value="Prontos para emissão" />
</aside>
</main>
);
}

function Card({ title, value }: { title: string; value: string }) {
return (
<div style={styles.card}>
<h3>{title}</h3>
<strong>{value}</strong>
</div>
);
}

const styles: any = {
page: {
minHeight: "100vh",
display: "grid",
gridTemplateColumns: "270px 1fr 340px",
background: "radial-gradient(circle at center, #063764 0%, #020617 48%, #000 100%)",
color: "white",
fontFamily: "Arial",
},
sidebar: {
padding: 28,
background: "rgba(2,6,23,.9)",
borderRight: "1px solid rgba(0,213,255,.25)",
},
logo: { fontSize: 30, margin: 0 },
subtitle: { color: "#7dd3fc", marginBottom: 40 },
nav: {
display: "flex",
flexDirection: "column",
gap: 20,
fontSize: 17,
color: "#dbeafe",
},
center: { padding: 40, textAlign: "center" },
title: { fontSize: 48, marginBottom: 8 },
desc: { color: "#93c5fd", fontSize: 18 },
avatarBox: {
display: "flex",
justifyContent: "center",
marginTop: 35,
},
avatar: {
width: 430,
height: 430,
objectFit: "cover",
borderRadius: "50%",
border: "4px solid rgba(0,213,255,.35)",
boxShadow: "0 0 120px #00d5ff",
},
button: {
marginTop: 30,
fontSize: 24,
padding: "18px 42px",
borderRadius: 18,
background: "#0b84ff",
color: "white",
border: "none",
cursor: "pointer",
boxShadow: "0 0 45px #0b84ff",
},
responseBox: {
marginTop: 35,
background: "rgba(15,23,42,.92)",
padding: 28,
borderRadius: 20,
border: "1px solid rgba(0,213,255,.25)",
textAlign: "left",
},
label: { color: "#94a3b8", marginTop: 12 },
command: { color: "#7dd3fc", fontSize: 22 },
answer: { fontSize: 23, lineHeight: 1.6 },
rightPanel: {
padding: 28,
background: "rgba(2,6,23,.9)",
borderLeft: "1px solid rgba(0,213,255,.25)",
display: "flex",
flexDirection: "column",
gap: 18,
},
card: {
background: "rgba(15,23,42,.95)",
padding: 20,
borderRadius: 18,
border: "1px solid rgba(0,213,255,.25)",
boxShadow: "0 0 30px rgba(0,213,255,.12)",
},
};