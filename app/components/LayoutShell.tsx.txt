"use client"

import Sidebar from "./Sidebar"
import Header from "./Header"

export default function LayoutShell({ children }: { children: React.ReactNode }) {
return (
<div style={{ display: "flex", background: "#020617" }}>

<Sidebar />

<div style={{ flex: 1 }}>
<Header />

<div style={{ padding: 30 }}>
{children}
</div>
</div>

</div>
)
}