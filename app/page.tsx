"use client"

import { useRouter } from "next/navigation"

export default function Home() {
const router = useRouter()

return (
<div style={{
height: "100vh",
display: "flex",
justifyContent: "center",
alignItems: "center",
flexDirection: "column",
background: "#020617",
color: "#fff"
}}>
<h1>🚀 Sistema Digital Twin</h1>

<button
onClick={() => router.push("/dashboard")}
style={{
marginTop: 20,
padding: "10px 20px",
background: "#22c55e",
border: "none",
borderRadius: 8,
cursor: "pointer"
}}
>
Entrar no Sistema
</button>
</div>
)
}