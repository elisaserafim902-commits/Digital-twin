"use client"

import { useRouter } from "next/navigation"

export default function Home() {
const router = useRouter()

function handleLogin() {
localStorage.setItem("user", "logado")
router.push("/dashboard")
}

return (
<div style={container}>
<div style={card}>
<h1 style={title}>Digital Twin</h1>
<p style={subtitle}>Acesso ao sistema</p>

<button onClick={handleLogin} style={button}>
Entrar
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
background: "#0070f3",
color: "#fff",
border: "none",
borderRadius: "8px",
cursor: "pointer",
}