"use client"

import { motion } from "framer-motion"
import {
LineChart,
Line,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer
} from "recharts"
import { useEffect, useState } from "react"

// GERADOR DE DADOS DINÂMICOS
function generateData() {
return Array.from({ length: 10 }).map((_, i) => ({
name: `T${i}`,
value: Math.floor(Math.random() * 100) + 50,
}))
}

export default function Dashboard() {
const [data, setData] = useState(generateData())
const [iaText, setIaText] = useState("Analisando sistema...")

// ATUALIZAÇÃO AUTOMÁTICA
useEffect(() => {
const interval = setInterval(() => {
setData(generateData())

const messages = [
"IA detectou aumento de eficiência",
"Sistema ajustando parâmetros automaticamente",
"Otimização energética em execução",
"Estabilidade operacional elevada",
"Previsão de crescimento positivo",
]

setIaText(messages[Math.floor(Math.random() * messages.length)])
}, 3000)

return () => clearInterval(interval)
}, [])

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

<div className="text-green-400 text-sm">
● IA Ativa
</div>
</div>

{/* KPIs */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

<motion.div whileHover={{ scale: 1.03 }} className="bg-white/5 p-6 rounded-2xl border border-white/10">
<p className="text-gray-400 text-sm">Produção</p>
<h2 className="text-4xl font-bold">87%</h2>
</motion.div>

<motion.div whileHover={{ scale: 1.03 }} className="bg-white/5 p-6 rounded-2xl border border-white/10">
<p className="text-gray-400 text-sm">Eficiência</p>
<h2 className="text-4xl font-bold text-green-400">+12%</h2>
</motion.div>

<motion.div whileHover={{ scale: 1.03 }} className="bg-white/5 p-6 rounded-2xl border border-white/10">
<p className="text-gray-400 text-sm">Alertas</p>
<h2 className="text-4xl font-bold text-red-400">2</h2>
</motion.div>

</div>

{/* GRÁFICO */}
<div className="mt-10 bg-white/5 p-6 rounded-2xl border border-white/10">
<p className="text-gray-400 mb-4">Performance em tempo real</p>

<ResponsiveContainer width="100%" height={300}>
<LineChart data={data}>
<XAxis dataKey="name" stroke="#888" />
<YAxis stroke="#888" />
<Tooltip />
<Line
type="monotone"
dataKey="value"
stroke="#3b82f6"
strokeWidth={3}
/>
</LineChart>
</ResponsiveContainer>
</div>

{/* IA */}
<div className="mt-10 bg-white/5 p-6 rounded-2xl border border-white/10">
<p className="text-gray-400 text-sm">Neuro IA</p>

<p className="mt-4 text-lg text-blue-400">
{iaText}
</p>
</div>

</main>
)
}