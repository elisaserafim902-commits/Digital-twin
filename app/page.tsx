"use client"

import LayoutShell from "./components/LayoutShell"
import Card from "./components/Card"

export default function Dashboard() {
return (
<LayoutShell>

<div className="mb-10">
<h1 className="text-4xl font-bold text-white mb-2">
🚀 Digital Twin Control
</h1>
<p className="text-gray-400">
Plataforma inteligente de monitoramento e decisão em tempo real
</p>
</div>

<div className="grid md:grid-cols-3 gap-6">

<Card title="Status do Sistema">
<span className="text-green-400">Operacional</span>
</Card>

<Card title="Usuários Ativos">
128
</Card>

<Card title="Projetos Inteligentes">
12
</Card>

</div>

</LayoutShell>
)
}