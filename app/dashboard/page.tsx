"use client";

import { useEffect, useRef, useState } from "react";

export default function Dashboard() {
const [texto, setTexto] = useState("");
const [resposta, setResposta] = useState("Olá Elisa. NeuroTwin 2050 operacional.");
const recognitionRef = useRef<any>(null);

useEffect(() => {
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
setResposta("Analisando...");

try {
const r = await fetch("/api/chat", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ message: frase }),
});

const data = await r.json();
const reply = data.reply || data.answer || "Resposta não encontrada.";

setResposta(reply);

const voz = new SpeechSynthesisUtterance(reply);
voz.lang = "pt-BR";
window.speechSynthesis.cancel();
window.speechSynthesis.speak(voz);
} catch {
setResposta("Falha ao consultar o núcleo NeuroBot.");
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
<p style={styles.small}>Centro Cognitivo Institucional</p>

<nav style={styles.nav}>
<span>🧠 Centro Cognitivo</span>
<span>🌎 Observatório Global</span>
<span>📈 Tendências</span>
<span>⚠️ Alertas</span>
<span>📄 Relatórios</span>
<span>🤖 NeuroBot</span>
<span>⚙️ Configurações</span>
</nav>
</aside>

<section style={styles.center}>
<h2 style={styles.title}>Sistema Neural Inteligente</h2>
<p style={styles.subtitle}>Monitoramento, previsão e decisão estratégica</p>

<img src="/avatar-neuro.png" alt="NeuroTwin Avatar" style={styles.avatar} />

<button onClick={ouvir} style={styles.mic}>🎙 Conversar</button>

<div style={styles.box}>
<p style={styles.label}>Você disse:</p>
<p style={styles.userText}>{texto || "Aguardando comando de voz..."}</p>

<p style={styles.label}>NeuroBot respondeu:</p>
<p style={styles.answer}>{resposta}</p>
</div>
</section>

<aside style={styles.panel}>
<Card title="Status Global" value="Operacional" />
<Card title="Fontes Ativas" value="12 módulos" />
<Card title="Alertas Críticos" value="0" />
<Card title="Oportunidades" value="24 detectadas" />
<Card title="Relatórios" value="Prontos para emissão" />
</aside>
</main>
);
}

function Card({ title, value }: { title: string; value: string }) {
return (
<div style={styles.card}>
<h3>{title}</h3>
<p>{value}</p>
</div>
);
}

const styles: any = {
page: {
minHeight: "100vh",
background: "radial-gradient(circle at center, #0b3b70 0%, #020617 45%, #000 100%)",
color: "white",
display: "grid",
gridTemplateColumns: "260px 1fr 340px",
fontFamily: "Arial",
},
sidebar: {
padding: 28,
background: "rgba(2,6,23,.85)",
borderRight: "1px solid rgba(0,213,255,.25)",
},
logo: { fontSize: 28, margin: 0 },
small: { color: "#94a3b8", marginBottom: 40 },
nav: {
display: "flex",
flexDirection: "column",
gap: 20,
color: "#cbd5e1",
fontSize: 17,
},
center: {
textAlign: "center",
padding: 40,
},
title: { fontSize: 46, marginBottom: 8 },
subtitle: { color: "#7dd3fc", fontSize: 18 },
avatar: {
width: 430,
height: 430,
objectFit: "cover",
borderRadius: "50%",
marginTop: 30,
boxShadow: "0 0 120px #00d5ff",
border: "4px solid rgba(0,213,255,.35)",
},
mic: {
marginTop: 30,
fontSize: 26,
padding: "18px 42px",
borderRadius: 18,
background: "#0b84ff",
color: "white",
border: "none",
cursor: "pointer",
boxShadow: "0 0 45px #0b84ff",
},
box: {
marginTop: 35,
background: "rgba(15,23,42,.9)",
padding: 28,
borderRadius: 20,
border: "1px solid rgba(0,213,255,.25)",
textAlign: "left",
},
label: { color: "#94a3b8", marginTop: 16 },
userText: { color: "#7dd3fc", fontSize: 22 },
answer: { fontSize: 23, lineHeight: 1.6 },
panel: {
padding: 28,
background: "rgba(2,6,23,.85)",
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
