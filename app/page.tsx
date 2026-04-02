"use client"

import { useRouter } from "next/navigation"

export default function Home() {
const router = useRouter()

return (
<div style={{
height: "100vh",
background: "radial-gradient(circle, #020617, #000)",
color: "#fff",
display: "flex",
flexDirection: "column",
justifyContent: "center",
alignItems: "center"
}}>
<h1>🚀 Digital Twin Platform</h1>
<p>Sistema inteligente de gestão</p>

<button
onClick={() => router.push("/dashboard")}
style={{
marginTop: 20,
padding: "12px 24px",
background: "#22c55e",
border: "none",
borderRadius: 10,
cursor: "pointer"
}}
>
Entrar
</button>
</div>
)
}