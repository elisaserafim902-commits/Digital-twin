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

export default function Dashboard() {

const data = [
{ name: "00h", value: 30 },
{ name: "04h", value: 45 },
{ name: "08h", value: 60 },
{ name: "12h", value: 80 },
{ name: "16h", value: 70 },
{ name: "20h", value: 90 },
]

return (
<main className="min-h-screen bg-[#020617] text-white p-8">

{/* HEADER */}
<div className="flex justify-between items-center mb-10">
<h1 className="text-2xl font-semibold">
NeuroTwin Control
</h1>

<div className="text-sm text-gray-400">
Sistema ativo • Tempo real
</div>
</div>

{/* GRID CARDS */}
<div className="grid grid-cols-3 gap-6">

{/* CARD 1 */}
<motion.div
whileHover={{ scale: 1.02 }}
className="bg-white/5 backdrop-blur-xl p-6 rounded-xl border border-white/10"
>
<h2 className="text-gray-400 text-sm mb-2">
Produção
</h2>

<p className="text-3xl font-bold">
87%
</p>
</motion.div>

{/* CARD 2 */}
<motion.div
whileHover={{ scale: 1.02 }}
className="bg-white/5 backdrop-blur-xl p-6 rounded-xl border border-white/10"
>
<h2 className="text-gray-400 text-sm mb-2">
Eficiência
</h2>

<p className="text-3xl font-bold text-green-400">
+12.4%
</p>
</motion.div>

{/* CARD 3 */}
<motion.div
whileHover={{ scale: 1.02 }}
className="bg-white/5 backdrop-blur-xl p-6 rounded-xl border border-white/10"
>
<h2 className="text-gray-400 text-sm mb-2">
Alertas
</h2>

<p className="text-3xl font-bold text-red-400">
3
</p>
</motion.div>

</div>

{/* GRÁFICO */}
<div className="mt-10 bg-white/5 p-6 rounded-xl border border-white/10">
<h2 className="text-gray-400 mb-4">
Produção em tempo real
</h2>

<div className="h-64">
<ResponsiveContainer width="100%" height="100%">
<LineChart data={data}>
<XAxis dataKey="name" stroke="#888" />
<YAxis stroke="#888" />
<Tooltip />
<Line
type="monotone"
dataKey="value"
stroke="#06b6d4"
strokeWidth={3}
/>
</LineChart>
</ResponsiveContainer>
</div>
</div>

</main>
)
}