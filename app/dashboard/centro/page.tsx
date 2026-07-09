export default function CentroOperacional() {
return (
<main style={styles.page}>
<header style={styles.header}>
<div>
<h1>NeuroTwin 2050</h1>
<p>Centro Nacional de Inteligência Operacional</p>
</div>
<div style={styles.status}>● SISTEMA OPERACIONAL</div>
</header>

<section style={styles.grid}>
<aside style={styles.panel}>
<h2>Comando Estratégico</h2>
<Item label="Defesa Civil" value="Monitoramento ativo" />
<Item label="Clima Nacional" value="Risco moderado" />
<Item label="Projetos Públicos" value="12 em análise" />
<Item label="Relatórios" value="Prontos para emissão" />
</aside>

<section style={styles.center}>
<h2>Observatório Nacional Integrado</h2>
<div style={styles.globe}>🌐</div>
<p>187 países monitorados • dados climáticos, ambientais, econômicos e estratégicos</p>
</section>

<aside style={styles.panel}>
<h2>Alertas Prioritários</h2>
<Item label="Clima" value="Sul do Brasil em observação" />
<Item label="Terremotos" value="Baixo risco nacional" />
<Item label="Vulcões" value="Sem impacto direto" />
<Item label="Economia" value="Atenção a mercados globais" />
</aside>
</section>

<section style={styles.footer}>
<Card title="IA Estratégica" value="Análise executiva ativa" />
<Card title="Banco de Memória" value="Contexto institucional carregado" />
<Card title="Relatório Governo" value="Modelo executivo disponível" />
<Card title="Próxima Ação" value="Integrar APIs reais" />
</section>
</main>
);
}

function Item({ label, value }: { label: string; value: string }) {
return (
<div style={styles.item}>
<strong>{label}</strong>
<span>{value}</span>
</div>
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
background: "radial-gradient(circle at center, #082f49 0%, #020617 48%, #000 100%)",
color: "white",
fontFamily: "Arial",
padding: 32,
},
header: {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
borderBottom: "1px solid rgba(0,213,255,.25)",
paddingBottom: 22,
},
status: {
color: "#22c55e",
fontWeight: "bold",
border: "1px solid rgba(34,197,94,.5)",
padding: "12px 18px",
borderRadius: 14,
},
grid: {
marginTop: 28,
display: "grid",
gridTemplateColumns: "310px 1fr 310px",
gap: 24,
},
panel: {
background: "rgba(15,23,42,.92)",
border: "1px solid rgba(0,213,255,.25)",
borderRadius: 22,
padding: 24,
},
center: {
minHeight: 540,
background: "rgba(15,23,42,.72)",
border: "1px solid rgba(0,213,255,.35)",
borderRadius: 28,
display: "flex",
flexDirection: "column",
justifyContent: "center",
alignItems: "center",
textAlign: "center",
boxShadow: "0 0 100px rgba(0,213,255,.18)",
},
globe: {
fontSize: 210,
filter: "drop-shadow(0 0 70px #00d5ff)",
margin: 20,
},
item: {
display: "flex",
flexDirection: "column",
gap: 8,
padding: 16,
marginBottom: 14,
background: "rgba(2,6,23,.8)",
borderRadius: 16,
border: "1px solid rgba(125,211,252,.18)",
},
footer: {
marginTop: 24,
display: "grid",
gridTemplateColumns: "repeat(4, 1fr)",
gap: 18,
},
card: {
background: "rgba(15,23,42,.95)",
border: "1px solid rgba(0,213,255,.25)",
borderRadius: 18,
padding: 20,
},
};