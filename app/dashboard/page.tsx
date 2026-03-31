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
}, [router])

function logout() {
localStorage.removeItem("user")
router.push("/")
}

return (
<div style={container}>
<div style={card}>
<h1 style={title}>Dashboard</h1>
<p style={subtitle}>Você está logado com sucesso</p>

<button onClick={logout} style={button}>
Sair
</button>
</div>
</div>
)
}

const container = {
display: "flex",
alignItems: "center",
justifyContent: "center",
height: "100vh",
background: "#f4f6f8",
}

const card = {
background: "#fff",
padding: "40px",
borderRadius: "12px",
boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
textAlign: "center" as const,
width: "300px",
}

const title = {
marginBottom: "10px",
}

const subtitle = {
color: "#666",
marginBottom: "20px",
}

const button = {
padding: "12px",
width: "100%",
background: "#ff4d4f",
color: "#fff",
border: "none",
borderRadius: "8px",
cursor: "pointer",
}