"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Dashboard() {
const router = useRouter()

useEffect(() => {
const user = localStorage.getItem("user")

if (!user) {
router.push("/")
}
}, [])

function sair() {
localStorage.removeItem("user")
router.push("/")
}

return (
<div style={{ padding: 40 }}>
<h1>📊 Dashboard</h1>
<p>Você está logado no sistema</p>

<button onClick={sair}>
Sair
</button>
</div>
)
}