"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Home() {
const router = useRouter()
const [ready, setReady] = useState(false)

useEffect(() => {
setReady(true)
}, [])

function handleLogin() {
if (typeof window !== "undefined") {
localStorage.setItem("user", "logado")
router.push("/dashboard")
}
}

if (!ready) return null

return (
<div style={{ padding: 40 }}>
<h1>Login</h1>

<button onClick={handleLogin}>
Entrar
</button>
</div>
)
}