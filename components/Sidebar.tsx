import Link from "next/link"

export default function Sidebar() {
return (
<aside className="w-64 min-h-screen bg-slate-900 text-white p-6">
<h2 className="text-2xl font-bold mb-6">
NeuroTwin
</h2>

<nav className="flex flex-col gap-4">
<Link href="/dashboard">Dashboard</Link>

<Link href="/dashboard/observatorio">
Observatório Global
</Link>

<Link href="/dashboard/tendencias">
Tendências
</Link>

<Link href="/dashboard/oportunidades">
Oportunidades
</Link>

<Link href="/dashboard/neurobot">
NeuroBot
</Link>

<Link href="/dashboard/relatorios">
Relatórios
</Link>
</nav>
</aside>
)
}