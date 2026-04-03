"use client"

import Sidebar from "./Sidebar"
import Header from "./Header"
import React from "react"

export default function LayoutShell({ children }: { children: React.ReactNode }) {
return (
<div className="flex min-h-screen bg-[#020617] text-white">

<Sidebar />

<div className="flex-1 flex flex-col">

<Header />

<main className="p-8">
{children}
</main>

</div>
</div>
)
}