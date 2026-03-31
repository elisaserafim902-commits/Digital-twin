"use client"

import { useRouter } from "next/navigation"

export default function Home() {
const router = useRouter()

function entrar() {
localStorage.setItem("user", "ok")
router.push("/dashboard")
}

return (
<div style={{
height: "100vh",
display: "flex",
alignItems: "center",
justifyContent: "center",
background: "#0f172a",
color: "#fff"
}}>
<div style={{ textAlign: "center" }}>
<h1 style={{ fontSize: 32 }}>🚀 Digital Twin</h1>
<p>Sistema inteligente online</p>

<button
onClick={entrar}
style={{
marginTop: 20,
padding: "12px 24px",
background: "#22c55e",
border: "none",
borderRadius: 8,
color: "#fff",
cursor: "pointer"
}}
>
Entrar no sistema
</button>
</div>
</div>
)
}