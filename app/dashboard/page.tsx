"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Dashboard() {
const router = useRouter()
const [ready, setReady] = useState(false)

useEffect(() => {
if (typeof window !== "undefined") {
const user = localStorage.getItem("user")

if (!user) {
router.push("/")
} else {
setReady(true)
}
}
}, [router])

function logout() {
localStorage.removeItem("user")
router.push("/")
}

if (!ready) return null

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