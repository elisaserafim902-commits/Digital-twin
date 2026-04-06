"use client"

import { motion } from "framer-motion"
import { Cpu, Zap, Brain } from "lucide-react"

export default function Home() {
return (
<main className="min-h-screen bg-[#020617] text-white overflow-hidden">

{/* BACKGROUND FUTURISTA */}
<div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,#0ea5e9,transparent_40%),radial-gradient(circle_at_bottom,#9333ea,transparent_40%)] opacity-20 blur-3xl"></div>

{/* HERO */}
<section className="h-screen flex flex-col justify-center items-center text-center px-6">

<motion.h1
initial={{ opacity: 0, scale: 0.9 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ duration: 1 }}
className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent"
>
Digital Twin AI
</motion.h1>

<motion.p
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ delay: 0.5 }}
className="mt-6 text-gray-400 max-w-xl"
>
Uma nova geração de controle inteligente, simulação e decisões automatizadas.
</motion.p>

<motion.button
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ delay: 1 }}
className="mt-8 px-10 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 transition shadow-[0_0_60px_rgba(34,211,238,0.5)]"
>
Acessar Sistema
</motion.button>

</section>

{/* FEATURES FUTURISTAS */}
<section className="py-24 px-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-10">

<Feature
icon={<Cpu size={40} />}
title="Processamento Avançado"
desc="Simulações em tempo real com performance extrema"
/>

<Feature
icon={<Brain size={40} />}
title="Inteligência Artificial"
desc="Decisões automatizadas com aprendizado contínuo"
/>

<Feature
icon={<Zap size={40} />}
title="Velocidade Extrema"
desc="Resposta instantânea para ambientes críticos"
/>

</section>

{/* DASHBOARD MOCK */}
<section className="py-20 px-6 flex justify-center">

<motion.div
initial={{ opacity: 0, y: 80 }}
whileInView={{ opacity: 1, y: 0 }}
transition={{ duration: 1 }}
className="w-full max-w-5xl p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_80px_rgba(59,130,246,0.2)]"
>

<div className="h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl flex items-center justify-center">
<span className="text-gray-400">Dashboard Inteligente</span>
</div>

</motion.div>

</section>

{/* CTA FINAL */}
<section className="py-24 text-center">

<h2 className="text-4xl font-bold">
Controle o futuro agora
</h2>

<button className="mt-6 px-10 py-4 bg-purple-500 hover:bg-purple-400 rounded-xl shadow-lg shadow-purple-500/30 transition">
Iniciar Experiência
</button>

</section>

</main>
)
}

function Feature({ icon, title, desc }: any) {
return (
<motion.div
whileHover={{ scale: 1.05 }}
className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-center"
>
<div className="flex justify-center text-cyan-400">{icon}</div>
<h3 className="mt-4 text-xl font-semibold">{title}</h3>
<p className="mt-2 text-gray-400">{desc}</p>
</motion.div>
)
}