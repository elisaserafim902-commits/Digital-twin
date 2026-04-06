"use client"

import { motion } from "framer-motion"

export default function Home() {
return (
<main className="min-h-screen bg-[#020617] text-white flex items-center justify-center relative overflow-hidden">

{/* GLOW BACKGROUND */}
<div className="absolute w-[600px] h-[600px] bg-cyan-500/20 blur-[150px] top-[-100px] left-[-100px]" />
<div className="absolute w-[600px] h-[600px] bg-purple-500/20 blur-[150px] bottom-[-100px] right-[-100px]" />

{/* CONTEÚDO */}
<motion.div
initial={{ opacity: 0, scale: 0.9 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ duration: 0.6 }}
className="text-center space-y-8 z-10"
>
<h1 className="text-5xl font-bold tracking-tight">
NeuroTwin Platform
</h1>

<p className="text-gray-400 text-lg">
Sistema industrial inteligente em tempo real
</p>

{/* BOTÃO PREMIUM */}
<a
href="/login"
className="relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-lg font-semibold hover:scale-105 transition"
>
Entrar no Sistema
</a>

{/* LINHA TECH */}
<div className="flex justify-center gap-6 text-gray-500 text-sm pt-6">
<span>IA</span>
<span>•</span>
<span>Digital Twin</span>
<span>•</span>
<span>Real-time</span>
</div>
</motion.div>
</main>
)
}