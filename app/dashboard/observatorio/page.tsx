"use client";

import { useEffect, useState } from "react";

export default function ObservatorioGlobal() {
const [data, setData] = useState<any>(null);

useEffect(() => {
fetch("/api/observatorio")
.then((res) => res.json())
.then((json) => setData(json))
.catch(() => setData(null));
}, []);

return (
<main style={styles.page}>
<section style={styles.header}>
<h1>Observatório Global NeuroTwin</h1>
<p>Monitoramento climático, geopolítico, ambiental e estratégico em tempo real.</p>
</section>

<section style={styles.grid}>
<div style={styles.map}>
<div style={styles.globe}>🌍</div>
<h2>Globo Operacional</h2>
<p>{data?.paisesMonitorados || 187} países monitorados</p>
<p>Status: {data?.status || "online"}</p>
</div>

<div style={styles.panel}>
<h2>Alertas Ativos</h2>
{(data?.alertas || []).map((item: any, index: number) => (
<div key={index} style={styles.card}>
<strong>{item.tipo}</strong>
<p>Nível: {item.nivel}</p>
<p>Local: {item.local}</p>
</div>
))}
</div>

<div style={styles.panel}>
<h2>Módulos Estratégicos</h2>
{(data?.modulos || []).map((modulo: string, index: number) => (
<div key={index} style={styles.card}>
{modulo}
</div>
))}
</div>
</section>
</main>
);
}

const styles: any = {
page: {
minHeight: "100vh",
background: "radial-gradient(circle at center, #0b3b70 0%, #020617 50%, #000 100%)",
color: "white",
fontFamily: "Arial",
padding: 40,
},
header: {
marginBottom: 30,
},
grid: {
display: "grid",
gridTemplateColumns: "1.5fr 1fr 1fr",
gap: 24,
},
map: {
minHeight: 520,
borderRadius: 24,
border: "1px solid rgba(0,213,255,.3)",
background: "rgba(15,23,42,.85)",
display: "flex",
flexDirection: "column",
alignItems: "center",
justifyContent: "center",
boxShadow: "0 0 80px rgba(0,213,255,.2)",
},
globe: {
fontSize: 180,
filter: "drop-shadow(0 0 60px #00d5ff)",
},
panel: {
borderRadius: 24,
border: "1px solid rgba(0,213,255,.3)",
background: "rgba(15,23,42,.85)",
padding: 24,
},
card: {
padding: 18,
marginBottom: 14,
borderRadius: 16,
background: "rgba(2,6,23,.85)",
border: "1px solid rgba(125,211,252,.25)",
},
};