"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
const router = useRouter()

const [email, setEmail] = useState("")
const [password, setPassword] = useState("")

const handleLogin = async (e: any) => {
e.preventDefault()

const res = await signIn("credentials", {
email,
password,
redirect: false
})

if (res?.ok) {
router.push("/dashboard")
} else {
alert("Login inválido")
}
}

return (
<div className="flex flex-col items-center justify-center h-screen text-white">
<h1 className="text-3xl mb-4">Login</h1>

<form onSubmit={handleLogin} className="flex flex-col gap-2">
<input
placeholder="Email"
value={email}
onChange={(e) => setEmail(e.target.value)}
className="text-black p-2"
/>

<input
type="password"
placeholder="Senha"
value={password}
onChange={(e) => setPassword(e.target.value)}
className="text-black p-2"
/>

<button className="bg-white text-black p-2">Entrar</button>
</form>

{/* 🔥 NOVO BOTÃO */}
<button
onClick={() => router.push("/register")}
className="mt-4 underline"
>
Criar conta
</button>
</div>
)
}