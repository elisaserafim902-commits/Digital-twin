"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"

export default function LoginPage() {
const [isRegister, setIsRegister] = useState(false)

const [email, setEmail] = useState("")
const [password, setPassword] = useState("")
const [companyName, setCompanyName] = useState("")

async function handleAuth() {
if (isRegister) {
const res = await fetch("/api/register", {
method: "POST",
body: JSON.stringify({ email, password, companyName })
})

const data = await res.json()

if (data.error) {
alert(data.error)
return
}
}

// LOGIN AUTOMÁTICO
await signIn("credentials", {
email,
password,
redirect: true,
callbackUrl: "/dashboard"
})
}

return (
<div className="min-h-screen flex items-center justify-center bg-[#020617] text-white">
<div className="bg-white/10 p-8 rounded-xl backdrop-blur-xl w-[350px] space-y-4">

<h1 className="text-2xl font-bold text-center">
{isRegister ? "Criar Conta" : "Login"}
</h1>

{isRegister && (
<input
placeholder="Nome da empresa"
className="w-full p-2 rounded text-black"
onChange={(e) => setCompanyName(e.target.value)}
/>
)}

<input
placeholder="Email"
className="w-full p-2 rounded text-black"
onChange={(e) => setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Senha"
className="w-full p-2 rounded text-black"
onChange={(e) => setPassword(e.target.value)}
/>

<button
onClick={handleAuth}
className="w-full bg-blue-600 p-2 rounded"
>
{isRegister ? "Criar conta e entrar" : "Entrar"}
</button>

<p
className="text-center cursor-pointer text-sm text-gray-300"
onClick={() => setIsRegister(!isRegister)}
>
{isRegister
? "Já tem conta? Fazer login"
: "Não tem conta? Criar agora"}
</p>
</div>
</div>
)
}