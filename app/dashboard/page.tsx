"use client"

import LayoutShell from "../components/LayoutShell"
import Card from "../components/Card"

export default function Dashboard() {
return (
<LayoutShell>
<h1 className="text-4xl font-bold text-white mb-6">
📊 Dashboard
</h1>

<div className="grid grid-cols-3 gap-6">
<Card title="STATUS">
Operacional
</Card>

<Card title="USUÁRIOS">
128
</Card>

<Card title="PROJETOS">
12
</Card>
</div>
</LayoutShell>
)
}