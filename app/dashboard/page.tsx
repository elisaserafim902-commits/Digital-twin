"use client"

import LayoutShell from "../components/LayoutShell"
import Card from "../components/Card"

export default function Dashboard() {
return (
<LayoutShell>

<h1 className="text-4xl font-bold text-green-500 mb-6">
🚀 Dashboard
</h1>

<div className="grid grid-cols-3 gap-6">

<Card>
<p className="text-lg">Status:</p>
<p className="text-2xl font-semibold text-green-400">
Operacional 🚀
</p>
</Card>

<Card>
<p className="text-lg">Usuários:</p>
<p className="text-2xl font-semibold text-blue-400">
128
</p>
</Card>

<Card>
<p className="text-lg">Projetos Ativos:</p>
<p className="text-2xl font-semibold text-purple-400">
12
</p>
</Card>

</div>

</LayoutShell>
)
}