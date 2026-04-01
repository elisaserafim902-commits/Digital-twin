"use client"

import Sidebar from "../components/Sidebar"

export default function Projects() {
return (
<div style={{ display: "flex" }}>
<Sidebar />

<div style={{
flex: 1,
padding: 40,
background: "#0f172a",
color: "#fff",
minHeight: "100vh"
}}>
<h1>📁 Projetos</h1>

<div style={{ marginTop: 20 }}>
<p>Projeto A - Em andamento</p>
<p>Projeto B - Concluído</p>
</div>
</div>
</div>
)
}