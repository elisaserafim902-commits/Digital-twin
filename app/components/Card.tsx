"use client"

export default function Card({ title, children }: any) {
return (
<div className="
bg-[#111827]
border border-[#1f2937]
rounded-2xl
p-6
shadow-lg
hover:scale-[1.02]
transition-all
duration-300
">
<p className="text-gray-400 text-sm mb-2">{title}</p>
<div>{children}</div>
</div>
)
}