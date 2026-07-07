export default function Oportunidades() {
return (
<main style={{ minHeight: "100vh", background: "#020617", color: "white", padding: 40, fontFamily: "Arial" }}>
<h1>Radar de Oportunidades</h1>
<p>Identificação de projetos, editais, parcerias, investimentos e prioridades públicas.</p>

<section style={{ marginTop: 30, display: "grid", gap: 20 }}>
<Card title="Governo Digital" value="Alta prioridade institucional" />
<Card title="Defesa Civil Inteligente" value="Potencial de implantação imediata" />
<Card title="Observatório Municipal" value="Aplicável a prefeituras e estados" />
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