"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { motion } from "framer-motion"

export default function LoginPage() {
const [loading, setLoading] = useState(false)

async function handleLogin() {
setLoading(true)
await signIn("credentials", {
redirect: true,
callbackUrl: "/dashboard",
})
}

return (
<div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden">

{/* BACKGROUND FUTURISTA */}
<div className="absolute w-[500px] h-[500px] bg-cyan-500/20 blur-[120px] top-[-100px] left-[-100px]" />
<div className="absolute w-[500px] h-[500px] bg-purple-500/20 blur-[120px] bottom-[-100px] right-[-100px]" />

<motion.div
initial={{ opacity: 0, scale: 0.9 }}
animate={{ opacity: 1, scale: 1 }}
className="w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
>

<h1 className="text-3xl font-bold text-center text-cyan-400">
NeuroTwin
</h1>

<p className="text-center text-gray-400 mt-2">
Acesso ao sistema inteligente
</p>

<button
onClick={handleLogin}
disabled={loading}
className="mt-8 w-full py-3 bg-cyan-500 hover:bg-cyan-400 rounded-xl transition shadow-[0_0_30px_rgba(34,211,238,0.4)]"
>
{loading ? "Entrando..." : "Entrar no sistema"}
</button>

</motion.div>
</div>
)
}