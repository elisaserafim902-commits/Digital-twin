"use client"

import LayoutShell from "../components/LayoutShell"
import Card from "../components/Card"

export default function Dashboard() {
return (
<LayoutShell>

<div className="mb-8">
<h1 className="text-4xl font-bold text-white">
Dashboard
</h1>
<p className="text-gray-400 mt-2">
Visão geral do sistema em tempo real
</p>
</div>

<div className="grid md:grid-cols-3 gap-6">

<Card title="Status">
<span className="text-green-400 font-semibold">
● Operacional
</span>
</Card>

<Card title="Usuários">
<span className="text-3xl font-bold text-white">
128
</span>
</Card>

<Card title="Projetos">
<span className="text-3xl font-bold text-white">
12 ativos
</span>
</Card>

</div>

</LayoutShell>
)
}