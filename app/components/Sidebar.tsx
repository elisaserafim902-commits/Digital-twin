"use client"

export default function Sidebar() {
return (
<aside className="
w-64
bg-[#020617]
border-r border-[#1f2937]
p-6
">
<h2 className="text-xl font-bold mb-8">
🚀 Digital Twin
</h2>

<nav className="space-y-4 text-gray-400">

<p className="hover:text-white cursor-pointer transition">
Dashboard
</p>

<p className="hover:text-white cursor-pointer transition">
Projetos
</p>

<p className="hover:text-white cursor-pointer transition">
Configurações
</p>

</nav>
</aside>
)
}