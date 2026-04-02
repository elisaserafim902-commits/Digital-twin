"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Sidebar() {
const path = usePathname()

function Item({ href, label }: any) {
const active = path === href

return (
<Link href={href}>
<div style={{
padding: 12,
borderRadius: 8,
background: active ? "#1e293b" : "transparent",
cursor: "pointer"
}}>
{label}
</div>
</Link>
)
}

return (
<div style={{
width: 260,
background: "#020617",
borderRight: "1px solid #1e293b",
color: "#fff",
padding: 20
}}>
<h2 style={{ marginBottom: 30 }}>🚀 Digital Twin</h2>

<Item href="/dashboard" label="📊 Dashboard" />
<Item href="/projects" label="📁 Projetos" />
</div>
)
}