"use client"

import { useRouter } from "next/navigation"

export default function Home() {
const router = useRouter()

function handleLogin() {
try {
localStorage.setItem("user", "logado")
router.push("/dashboard")
} catch (e) {
console.error(e)
}
}

return (
<div style={{ padding: 40 }}>
<h1>Login</h1>

<button onClick={handleLogin}>
Entrar
</button>
</div>
)
}