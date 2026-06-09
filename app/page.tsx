export default function Home() {
return (
<main
style={{
minHeight: "100vh",
background: "#020617",
color: "white",
display: "flex",
flexDirection: "column",
justifyContent: "center",
alignItems: "center",
fontFamily: "Arial"
}}
>
<h1 style={{ fontSize: "4rem", marginBottom: "20px" }}>
NeuroTwin
</h1>

<div style={{ fontSize: "120px" }}>
🤖
</div>

<h2>NeuroBot Online</h2>

<p>
Bem-vinda Elisa. Estou monitorando dados,
tendências e oportunidades.
</p>

<div style={{ marginTop: "30px" }}>
<a
href="/login"
style={{
background: "#2563eb",
padding: "12px 24px",
color: "white",
textDecoration: "none",
borderRadius: "8px",
marginRight: "10px"
}}
>
Entrar
</a>

<a
href="/register"
style={{
border: "1px solid #2563eb",
padding: "12px 24px",
color: "white",
textDecoration: "none",
borderRadius: "8px"
}}
>
Criar Conta
</a>
</div>
</main>
)
}