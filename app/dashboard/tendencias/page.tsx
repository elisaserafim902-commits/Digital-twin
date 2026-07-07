export default function Tendencias() {
return (
<main style={{ minHeight: "100vh", background: "#020617", color: "white", padding: 40, fontFamily: "Arial" }}>
<h1>Tendências Estratégicas</h1>
<p>Monitoramento de IA, economia, clima, tecnologia e oportunidades globais.</p>

<section style={{ marginTop: 30, display: "grid", gap: 20 }}>
<Card title="IA Generativa" value="Alta aceleração global" />
<Card title="Energia Limpa" value="Crescimento estratégico" />
<Card title="Cidades Inteligentes" value="Prioridade para governos" />
</section>
</main>
);
}

function Card({ title, value }: { title: string; value: string }) {
return (
<div style={{ padding: 24, borderRadius: 18, background: "rgba(15,23,42,.9)", border: "1px solid rgba(0,213,255,.25)" }}>
<h2>{title}</h2>
<p>{value}</p>
</div>
);
}
