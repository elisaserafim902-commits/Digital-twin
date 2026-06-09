"use client"

import { signOut } from "next-auth/react"

export default function DashboardLayout({
children,
}: {
children: React.ReactNode
}) {
return (
<div className="min-h-screen bg-[#020617] text-white">
<div className="flex justify-between items-center p-4 border-b border-slate-700">
<h1 className="text-xl font-bold">
NeuroTwin Dashboard
</h1>

<button
onClick={() => signOut()}
className="bg-red-500 px-4 py-2 rounded"
>
Sair
</button>
</div>

<main className="p-6">
{children}
</main>
</div>
)
}