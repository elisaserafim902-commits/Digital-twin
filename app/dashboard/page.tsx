"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Dashboard() {
const router = useRouter()

useEffect(() => {
try {
const user = localStorage.getItem("user")

if (!user) {
router.push("/")
}
} catch (e) {
console.error(e)
router.push("/")
}
}, [router])

function logout() {
try {
localStorage.removeItem("user")
router.push("/")
} catch (e) {
console.error(e)
}
}

return (
<div style={{ padding: 40 }}>
<h1>Dashboard</h1>
<p>Você está logado</p>

<button onClick={logout}>
Sair
</button>
</div>
)
}