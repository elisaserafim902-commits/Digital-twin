"use client"

import Link from "next/link"

export default function Sidebar() {
return (
<div style={{
width: 240,
background: "linear-gradient(180deg, #0f172a, #020617)",
color: "#fff",
padding: 20,
minHeight: "100vh",
borderRight: "1px solid #1e293b"
}}>
<h2 style={{ marginBottom: 30 }}>🚀 Digital Twin</h2>

<nav style={{ display: "flex", flexDirection: "column", gap: 15 }}>
<Link href="/dashboard">📊 Dashboard</Link>
<Link href="/projects">📁 Projetos</Link>
</nav>
</div>
)
}