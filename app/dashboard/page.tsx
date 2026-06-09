export default function Dashboard() {
return (
<main style={{
minHeight: "100vh",
background: "#020617",
color: "white",
padding: "30px"
}}>
<h1 style={{fontSize:"40px"}}>
🤖 NeuroTwin Command Center
</h1>

<p>
Sistema Industrial Inteligente em Tempo Real
</p>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(4,1fr)",
gap:"20px",
marginTop:"30px"
}}>
<div style={{background:"#0f172a",padding:"20px",borderRadius:"10px"}}>
Produção
<h2>98%</h2>
</div>

<div style={{background:"#0f172a",padding:"20px",borderRadius:"10px"}}>
Eficiência
<h2>94%</h2>
</div>

<div style={{background:"#0f172a",padding:"20px",borderRadius:"10px"}}>
IA Ativa
<h2>ONLINE</h2>
</div>

<div style={{background:"#0f172a",padding:"20px",borderRadius:"10px"}}>
Sensores
<h2>2.847</h2>
</div>
</div>
</main>
)
}