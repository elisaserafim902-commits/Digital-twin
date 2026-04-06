"use client"

export default function Sidebar() {
return (
<aside className="w-64 h-screen bg-[#0B0F19] border-r border-white/10 p-6">
<h1 className="text-white text-xl font-bold mb-10">NeuroTwin</h1>

<nav className="flex flex-col gap-4 text-gray-400">
<a href="/dashboard" className="hover:text-white">Dashboard</a>
<a href="#" className="hover:text-white">Digital Twin</a>
<a href="#" className="hover:text-white">Analytics</a>
<a href="#" className="hover:text-white">Settings</a>
</nav>
</aside>
)
} 
