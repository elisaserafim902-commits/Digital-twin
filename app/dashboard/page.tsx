"use client"

import { useSession } from "next-auth/react"

export default function Dashboard() {
const { data: session } = useSession()

return (
<div className="min-h-screen bg-[#020617] text-white p-10">

<h1 className="text-3xl font-bold text-cyan-400">
NeuroTwin Dashboard
</h1>

<p className="mt-4 text-gray-400">
Usuário: {session?.user?.name}
</p>

</div>
)
}