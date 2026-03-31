"use client"

import { useRouter } from "next/navigation"

export default function Home() {
const router = useRouter()

function entrar() {
localStorage.setItem("user", "ok")
router.push("/dashboard")
}

return (
<div style={{ padding: 40 }}>
<h1>🚀 Digital Twin System</h1>
<p>Sistema online ativo</p>

<button onClick={entrar}>
Entrar no sistema
</button>
</div>
)
}