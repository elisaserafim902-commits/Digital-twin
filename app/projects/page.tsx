"use client"

import LayoutShell from "../components/LayoutShell"
import Card from "../components/Card"

export default function Projects() {
return (
<LayoutShell>

<h1>📁 Projetos</h1>

<div style={{ marginTop: 20, display: "grid", gap: 15 }}>

<Card>
<strong>Projeto A</strong><br/>
Status: Em andamento 🚧
</Card>

<Card>
<strong>Projeto B</strong><br/>
Status: Concluído ✅
</Card>

</div>

</LayoutShell>
)
}