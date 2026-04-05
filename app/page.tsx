import LayoutShell from "@/components/LayoutShell"
import Card from "@/components/Card"

export default function Dashboard() {
return (
<LayoutShell>

{/* Header */}
<div className="mb-10">
<h1 className="text-4xl font-bold text-white mb-2">
🚀 Digital Twin Control
</h1>
<p className="text-gray-400">
Plataforma inteligente de monitoramento e decisão em tempo real
</p>
</div>

{/* Cards */}
<div className="grid md:grid-cols-3 gap-6">

<Card title="Status do Sistema">
<span className="text-green-400 font-semibold">
Operacional
</span>
</Card>

<Card title="Usuários Ativos">
<span className="text-2xl font-bold text-white">
128
</span>
</Card>

<Card title="Projetos Inteligentes">
<span className="text-2xl font-bold text-white">
12
</span>
</Card>

</div>

</LayoutShell>
)
}