"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Dashboard() {
const router = useRouter()

useEffect(() => {
const user = localStorage.getItem("user")
if (!user) router.push("/")
}, [])

function sair() {
localStorage.removeItem("user")
router.push("/")
}

return (
<div style={{
minHeight: "100vh",
background: "#0f172a",
color: "#fff",
padding: 40
}}>
<h1 style={{ fontSize: 28 }}>📊 Dashboard</h1>

<div style={{
marginTop: 20,
padding: 20,
background: "#1e293b",
borderRadius: 10
}}>
<p>Sistema ativo e funcionando</p>
</div>

<button
onClick={sair}
style={{
marginTop: 20,
padding: "10px 20px",
background: "#ef4444",
color: "#fff",
border: "none",
borderRadius: 6,
cursor: "pointer"
}}
>
Sair
</button>
</div>
)
}