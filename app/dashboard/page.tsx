"use client"

import { motion } from "framer-motion"

export default function Dashboard() {
return (
<main className="min-h-screen bg-gradient-to-br from-[#020617] via-[#020617] to-[#020617] text-white p-10">

{/* HEADER */}
<div className="flex justify-between items-center mb-12">
<div>
<h1 className="text-3xl font-bold">NeuroTwin Control</h1>
<p className="text-gray-400 text-sm">
Sistema industrial inteligente • Tempo real
</p>
</div>

<div className="text-sm text-green-400">
● Sistema Online
</div>
</div>

{/* GRID */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

{/* PRODUÇÃO */}
<motion.div
whileHover={{ scale: 1.03 }}
className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xl"
>
<p className="text-gray-400 text-sm">Produção</p>
<h2 className="text-4xl font-bold mt-2">87%</h2>
<p className="text-green-400 text-sm mt-1">+4.2% hoje</p>
</motion.div>

{/* EFICIÊNCIA */}
<motion.div
whileHover={{ scale: 1.03 }}
className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xl"
>
<p className="text-gray-400 text-sm">Eficiência</p>
<h2 className="text-4xl font-bold mt-2">92%</h2>
<p className="text-green-400 text-sm mt-1">+2.1% otimização</p>
</motion.div>

{/* ALERTAS */}
<motion.div
whileHover={{ scale: 1.03 }}
className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xl"
>
<p className="text-gray-400 text-sm">Alertas</p>
<h2 className="text-4xl font-bold mt-2 text-red-400">2</h2>
<p className="text-red-400 text-sm mt-1">
Pico de carga detectado
</p>
</motion.div>

</div>

{/* IA ANALYSIS */}
<div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">

{/* BLOCO IA */}
<div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xl">
<p className="text-gray-400 text-sm">Análise da IA</p>

<p className="mt-4 text-white leading-relaxed">
O sistema detectou aumento progressivo de eficiência nas últimas 4 horas.
Há indícios de otimização automática em execução.
</p>

<p className="mt-3 text-blue-400 text-sm">
Recomendação: manter parâmetros atuais.
</p>
</div>

{/* STATUS SISTEMA */}
<div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xl">
<p className="text-gray-400 text-sm">Status Operacional</p>

<div className="mt-4 space-y-2 text-sm">

<div className="flex justify-between">
<span>Linhas ativas</span>
<span className="text-green-400">12</span>
</div>

<div className="flex justify-between">
<span>Máquinas online</span>
<span className="text-green-400">98%</span>
</div>

<div className="flex justify-between">
<span>Latência sistema</span>
<span className="text-blue-400">32ms</span>
</div>

<div className="flex justify-between">
<span>Consumo energia</span>
<span className="text-yellow-400">Alto</span>
</div>

</div>
</div>

</div>

{/* ALERTAS DETALHADOS */}
<div className="mt-10 bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xl">
<p className="text-gray-400 text-sm mb-4">Eventos Recentes</p>

<div className="space-y-3 text-sm">

<div className="text-red-400">
⚠️ Pico de carga detectado às 16:32
</div>

<div className="text-yellow-400">
⚠️ Oscilação leve na linha 3
</div>

<div className="text-green-400">
✔️ Sistema estabilizado automaticamente
</div>

</div>
</div>

</main>
)
}