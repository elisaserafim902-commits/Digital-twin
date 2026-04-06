"use client"

import { motion } from "framer-motion"
import { Cpu, Brain, Activity } from "lucide-react"

export default function Home() {
return (
<main className="min-h-screen bg-[#020617] text-white overflow-hidden">

{/* BACKGROUND VIVO */}
<div className="absolute inset-0 -z-10">
<div className="absolute w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-3xl top-[-100px] left-[-100px] animate-pulse"></div>
<div className="absolute w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-3xl bottom-[-100px] right-[-100px] animate-pulse"></div>
</div>

{/* HEADER */}
<header className="flex justify-between items-center px-8 py-6 border-b border-white/10 backdrop-blur-xl bg-white/5">
<h1 className="text-xl font-bold text-cyan-400">Digital Twin</h1>
<button className="px-6 py-2 bg-cyan-500 rounded-lg hover:bg-cyan-400 transition">
Login
</button>
</header>

{/* HERO */}
<section className="py-20 text-center">

<motion.h1
initial={{ opacity: 0, y: 40 }}
animate={{ opacity: 1, y: 0 }}
className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
>
AI Control System
</motion.h1>

<p className="mt-6 text-gray-400 max-w-xl mx-auto">
Plataforma inteligente para simulação, monitoramento e decisões em tempo real.
</p>

</section>

{/* DASHBOARD REAL */}
<section className="px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

<Card icon={<Cpu />} title="Processamento" value="98.2%" />
<Card icon={<Brain />} title="IA Ativa" value="Online" />
<Card icon={<Activity />} title="Status Sistema" value="Operacional" />

</section>

{/* PAINEL PRINCIPAL */}
<section className="mt-12 px-6 max-w-7xl mx-auto">

<motion.div
initial={{ opacity: 0, y: 60 }}
animate={{ opacity: 1, y: 0 }}
className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_60px_rgba(59,130,246,0.2)]"
>

<h2 className="text-2xl font-semibold mb-6">Simulação em Tempo Real</h2>

<div className="h-72 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl flex items-center justify-center">
<span className="text-gray-400">Renderização Inteligente</span>
</div>

</motion.div>

</section>

{/* CTA */}
<section className="py-20 text-center">

<h2 className="text-3xl font-bold">
Domine o controle digital
</h2>

<button className="mt-6 px-10 py-4 bg-purple-500 hover:bg-purple-400 rounded-xl shadow-lg transition">
Acessar Plataforma
</button>

</section>

</main>
)
}

function Card({ icon, title, value }: any) {
return (
<motion.div
whileHover={{ scale: 1.05 }}
className="p-6 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10"
>
<div className="text-cyan-400 mb-2">{icon}</div>
<h3 className="text-gray-400 text-sm">{title}</h3>
<p className="text-xl font-bold">{value}</p>
</motion.div>
)
}