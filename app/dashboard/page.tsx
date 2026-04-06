"use client"

import { motion } from "framer-motion"

export default function Dashboard() {
return (
<main className="min-h-screen bg-[#020617] text-white p-8">

{/* HEADER */}
<div className="flex justify-between items-center mb-10">
<h1 className="text-2xl font-semibold">NeuroTwin Control</h1>
<div className="text-sm text-gray-400">
Sistema ativo • Tempo real
</div>
</div>

{/* GRID */}
<div className="grid grid-cols-3 gap-6">

{/* CARD 1 */}
<motion.div
whileHover={{ scale: 1.02 }}
className="bg-white/5 backdrop-blur-xl p-6 rounded-xl border border-white/10"
>
<h2 className="text-gray-400 text-sm mb-2">Produção</h2>
<p className="text-3xl font-bold">87%</p>
</motion.div>

{/* CARD 2 */}
<motion.div
whileHover={{ scale: 1.02 }}
className="bg-white/5 backdrop-blur-xl p-6 rounded-xl border border-white/10"
>
<h2 className="text-gray-400 text-sm mb-2">Eficiência</h2>
<p className="text-3xl font-bold text-green-400">+12.4%</p>
</motion.div>

{/* CARD 3 */}
<motion.div
whileHover={{ scale: 1.02 }}
className="bg-white/5 backdrop-blur-xl p-6 rounded-xl border border-white/10"
>
<h2 className="text-gray-400 text-sm mb-2">Alertas</h2>
<p className="text-3xl font-bold text-red-400">3</p>
</motion.div>

</div>

{/* SIMULAÇÃO */}
<div className="mt-10 bg-white/5 p-6 rounded-xl border border-white/10">
<h2 className="text-gray-400 mb-4">
Simulação em tempo real
</h2>

<div className="h-40 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg animate-pulse" />
</div>

</main>
)
}
