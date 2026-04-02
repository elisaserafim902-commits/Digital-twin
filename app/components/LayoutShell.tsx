export default function LayoutShell({ children }) {
return (
<div className="flex min-h-screen bg-[#0f172a] text-white">
<aside className="w-64 bg-[#020617] p-6">
<h2 className="text-xl font-bold mb-6">🚀 Digital Twin</h2>
<nav className="space-y-3 text-gray-400">
<p>Dashboard</p>
<p>Projetos</p>
<p>Configurações</p>
</nav>
</aside>

<main className="flex-1 p-10">
{children}
</main>
</div>
)
}