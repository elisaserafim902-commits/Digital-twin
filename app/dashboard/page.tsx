"use client"

import LayoutShell from "../components/LayoutShell"
import Card from "../components/Card"

export default function Dashboard() {
return (
<LayoutShell>

<h1>📊 Dashboard</h1>

<div style={{
display: "grid",
gridTemplateColumns: "repeat(3, 1fr)",
gap: 20,
marginTop: 20
}}>

<Card>Status: Operacional 🚀</Card>
<Card>Usuários: 128</Card>
<Card>Projetos Ativos: 12</Card>

</div>

</LayoutShell>
)
}