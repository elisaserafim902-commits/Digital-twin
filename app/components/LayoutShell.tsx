"use client"

import Sidebar from "./Sidebar"
import Header from "./Header"
import React from "react"

export default function LayoutShell({ children }: { children: React.ReactNode }) {
return (
<div className="
flex min-h-screen text-white
bg-gradient-to-br from-[#020617] via-[#020617] to-[#020617]
relative overflow-hidden
">

{/* Glow de fundo */}
<div className="absolute top-0 left-0 w-full h-full pointer-events-none">
<div className="absolute w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] top-[-100px] left-[-100px]" />
<div className="absolute w-[400px] h-[400px] bg-purple-500/10 blur-[120px] bottom-[-100px] right-[-100px]" />
</div>

<Sidebar />

<div className="flex-1 flex flex-col relative z-10">
<Header />

<main className="p-8">
{children}
</main>
</div>

</div>
)
}