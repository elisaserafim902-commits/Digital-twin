"use client"

type CardProps = {
title?: string
children: React.ReactNode
}

export default function Card({ title, children }: CardProps) {
return (
<div className="
relative
bg-[#020617]/80
backdrop-blur-xl
border border-cyan-500/10
rounded-2xl
p-6
shadow-[0_0_40px_rgba(0,255,255,0.08)]
hover:shadow-[0_0_60px_rgba(0,255,255,0.25)]
hover:border-cyan-400/40
transition-all duration-500
">

{/* Glow interno */}
<div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-30 pointer-events-none" />

{title && (
<p className="text-cyan-400 text-xs tracking-widest uppercase mb-3">
{title}
</p>
)}

<div className="text-white text-lg font-semibold">
{children}
</div>
</div>
)
}