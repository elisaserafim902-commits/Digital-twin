export default function Relatorios() {
return (
<main style={{
minHeight: "100vh",
background: "#020617",
color: "white",
padding: 40,
fontFamily: "Arial"
}}>
<h1>Relatórios Executivos NeuroTwin</h1>
<p>Geração de análises estratégicas para tomada de decisão pública.</p>

<section style={{
marginTop: 30,
display: "grid",
gridTemplateColumns: "repeat(3, 1fr)",
gap: 20
}}>
<Card title="Relatório Climático" desc="Riscos ambientais, eventos extremos e previsão operacional." />
<Card title="Relatório Estratégico" desc="Situação nacional, riscos, oportunidades e recomendações." />
<Card title="Relatório de Projetos" desc="Acompanhamento de iniciativas, impacto e prioridade." />
</section>

<section style={{
marginTop: 40,
background: "rgba(15,23,42,.9)",
padding: 30,
borderRadius: 20,
border: "1px solid rgba(0,213,255,.3)"
}}>
<h2>Resumo Executivo</h2>
<p>Status: Sistema operacional.</p>
<p>Alertas críticos: 0.</p>
<p>Países monitorados: 187.</p>
<p>Recomendação: priorizar Observatório Global e Centro Cognitivo.</p>
</section>
</main>
)
}

function Card({ title, desc }: { title: string; desc: string }) {
return (
<div style={{
background: "rgba(15,23,42,.9)",
padding: 24,
borderRadius: 18,
border: "1px solid rgba(0,213,255,.25)"
}}>
<h2>{title}</h2>
<p>{desc}</p>
</div>
)
}