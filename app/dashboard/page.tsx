"use client"

import Sidebar from "../components/Sidebar"

export default function Dashboard() {
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
<h1>📊 Dashboard</h1>

<div style={{
display: "grid",
gridTemplateColumns: "repeat(3, 1fr)",
gap: 20,
marginTop: 20
}}>

<div style={{ background: "#1e293b", padding: 20, borderRadius: 10 }}>
<h3>Projetos</h3>
<p>12 ativos</p>
</div>

<div style={{ background: "#1e293b", padding: 20, borderRadius: 10 }}>
<h3>Insights</h3>
<p>8 análises</p>
</div>

<div style={{ background: "#1e293b", padding: 20, borderRadius: 10 }}>
<h3>Status</h3>
<p>Online</p>
</div>

</div>
</div>
</div>
)
}