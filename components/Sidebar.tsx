"use client"

import Link from "next/link"

export default function Sidebar() {
return (
<aside className="w-64 h-screen bg-gray-900 text-white p-5">
<h2 className="text-xl font-bold mb-6">NeuroTwin</h2>

<nav className="flex flex-col gap-3">
<Link href="/dashboard">Dashboard</Link>
<Link href="/dashboard/projects">Projetos</Link>
<Link href="/dashboard/settings">Configurações</Link>
</nav>
</aside>
)
}