"use client"

import { motion } from "framer-motion"

export default function Home() {
return (
<main className="min-h-screen bg-gradient-to-b from-[#020617] to-[#0f172a] text-white">

{/* HERO */}
<section className="h-screen flex flex-col justify-center items-center text-center px-6">

<motion.h1
initial={{ opacity: 0, y: 40 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.8 }}
className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent"
>
Digital Twin Intelligence
</motion.h1>

<motion.p
initial={{ opacity: 0, y: 40 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: 0.3 }}
className="mt-6 text-lg text-gray-400 max-w-xl"
>
Controle, simulação e decisões em tempo real com tecnologia de ponta.
</motion.p>

<motion.button
initial={{ opacity: 0, y: 40 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: 0.6 }}
className="mt-8 px-8 py-3 bg-cyan-500 hover:bg-cyan-400 rounded-xl shadow-[0_0_40px_rgba(34,211,238,0.3)] transition"
>
Começar Agora
</motion.button>

</section>

{/* FEATURES */}
<section className="py-20 px-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

{[
{
title: "Simulação Inteligente",
desc: "Ambientes digitais com análise em tempo real"
},
{
title: "Controle Total",
desc: "Visualize e gerencie tudo em um só lugar"
},
{
title: "Decisão com IA",
desc: "Insights automáticos baseados em dados"
}
].map((item, i) => (
<motion.div
key={i}
initial={{ opacity: 0, y: 40 }}
whileInView={{ opacity: 1, y: 0 }}
transition={{ delay: i * 0.2 }}
className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:scale-105 transition"
>
<h3 className="text-xl font-semibold text-cyan-400">{item.title}</h3>
<p className="mt-2 text-gray-400">{item.desc}</p>
</motion.div>
))}

</section>

{/* CTA FINAL */}
<section className="py-20 text-center">

<h2 className="text-4xl font-bold">
Pronto para o futuro?
</h2>

<button className="mt-6 px-10 py-4 bg-purple-500 hover:bg-purple-400 rounded-xl shadow-lg shadow-purple-500/30 transition">
Criar Experiência
</button>

</section>

</main>
)
}