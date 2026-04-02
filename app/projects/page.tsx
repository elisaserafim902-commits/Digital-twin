"use client"

import Sidebar from "../components/Sidebar"
import Header from "../components/Header"

export default function Projects() {
return (
<div style={{ display: "flex" }}>

<Sidebar />

<div style={{ flex: 1 }}>
<Header />

<div style={{ padding: 40 }}>
<h1>📁 Projetos</h1>

<div style={{ marginTop: 20 }}>
<div style={{
background: "#0f172a",
padding: 20,
borderRadius: 10,
color: "#fff",
marginBottom: 10
}}>
Projeto A — Em andamento 🚧
</div>

<div style={{
background: "#0f172a",
padding: 20,
borderRadius: 10,
color: "#fff"
}}>
Projeto B — Concluído ✅
</div>
</div>
</div>
</div>

</div>
)
}