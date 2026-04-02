"use client"

import LayoutShell from "./components/LayoutShell"
import Card from "./components/Card"

export default function Dashboard() {
return (
<LayoutShell>
<h1 className="text-4xl font-bold text-white mb-6">
📊 Dashboard
</h1>

<div className="grid grid-cols-3 gap-6">
<Card>🚀 Status: Operacional</Card>
<Card>👥 Usuários: 128</Card>
<Card>📁 Projetos: 12</Card>
</div>
</LayoutShell>
)
}