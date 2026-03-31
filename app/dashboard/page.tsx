"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Dashboard() {
const router = useRouter()
const [loading, setLoading] = useState(true)

useEffect(() => {
try {
const user = localStorage.getItem("user")

if (!user) {
router.push("/")
} else {
setLoading(false)
}
} catch (error) {
router.push("/")
}
}, [router])

function logout() {
localStorage.removeItem("user")
router.push("/")
}

if (loading) {
return <p>Carregando...</p>
}

return (
<div
style={{
display: "flex",
alignItems: "center",
justifyContent: "center",
height: "100vh",
background: "#f4f6f8",
}}
>
<div
style={{
background: "#fff",
padding: "40px",
borderRadius: "12px",
boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
textAlign: "center",
}}
>
<h1>Dashboard</h1>
<p>Você está logado</p>

<button
onClick={logout}
style={{
padding: "12px",
marginTop: 20,
background: "#ff4d4f",
color: "#fff",
border: "none",
borderRadius: "8px",
cursor: "pointer",
}}
>
Sair
</button>
</div>
</div>
)
}