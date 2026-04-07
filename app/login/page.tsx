"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
const router = useRouter()

const [email, setEmail] = useState("")
const [password, setPassword] = useState("")
const [error, setError] = useState("")

async function handleLogin(e: any) {
e.preventDefault()

const res = await signIn("credentials", {
email,
password,
redirect: false,
})

if (res?.error) {
setError("Credenciais inválidas")
return
}

router.push("/dashboard")
}

return (
<div className="min-h-screen flex items-center justify-center bg-[#020617] text-white">

<form
onSubmit={handleLogin}
className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 w-[350px]"
>
<h1 className="text-2xl font-bold mb-6 text-center">
NeuroTwin Login
</h1>

{error && (
<p className="text-red-400 text-sm mb-4">{error}</p>
)}

<input
type="email"
placeholder="Email"
className="w-full mb-4 p-3 rounded bg-black/30 border border-white/10"
value={email}
onChange={(e) => setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Senha"
className="w-full mb-6 p-3 rounded bg-black/30 border border-white/10"
value={password}
onChange={(e) => setPassword(e.target.value)}
/>

<button
type="submit"
className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded font-semibold"
>
Entrar no Sistema
</button>
</form>

</div>
)
}