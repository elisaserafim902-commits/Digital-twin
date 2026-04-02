"use client"

import Sidebar from "../components/Sidebar"
import Header from "../components/Header"

export default function Dashboard() {
return (
<div style={{ display: "flex" }}>

<Sidebar />

<div style={{ flex: 1 }}>
<Header />

<div style={{ padding: 40 }}>
<h1>📊 Dashboard</h1>
<p>Bem-vindo ao sistema inteligente</p>

<div style={{ marginTop: 20 }}>
<div style={{
padding: 20,
background: "#0f172a",
borderRadius: 10,
color: "#fff"
}}>
Status: Operacional 🚀
</div>
</div>
</div>
</div>

</div>
)
}