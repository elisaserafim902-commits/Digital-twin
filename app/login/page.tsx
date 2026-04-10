"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"

export default function LoginPage() {
const [email, setEmail] = useState("")
const [password, setPassword] = useState("")

async function handleLogin() {
const res = await signIn("credentials", {
email,
password,
redirect: false
})

if (res?.ok) {
window.location.href = "/dashboard"
} else {
alert("Login inválido")
}
}

return (
<div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
<div className="bg-slate-900 p-8 rounded-lg w-80 space-y-4">
<h1 className="text-2xl font-bold text-center">Login</h1>

<input
placeholder="Email"
className="w-full p-2 rounded bg-slate-800"
onChange={(e) => setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Senha"
className="w-full p-2 rounded bg-slate-800"
onChange={(e) => setPassword(e.target.value)}
/>

<button
onClick={handleLogin}
className="w-full bg-blue-600 py-2 rounded"
>
Entrar
</button>
</div>
</div>
)
}