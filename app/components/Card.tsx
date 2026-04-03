"use client"

import React from "react"

type CardProps = {
title?: string
children: React.ReactNode
}

export default function Card({ title, children }: CardProps) {
return (
<div
className="
bg-[#020617]
border border-gray-800
rounded-2xl
p-6
shadow-lg
hover:scale-[1.02]
transition-all
duration-300
backdrop-blur
"
>
{title && (
<p className="text-gray-400 text-sm mb-2">
{title}
</p>
)}

<div className="text-white text-lg font-semibold">
{children}
</div>
</div>
)
}