"use client"

import Sidebar from "./Sidebar"
import Header from "./Header"

export default function LayoutShell({ children }: { children: React.ReactNode }) {
return (
<div style={{
display: "flex",
background: "#020617"
}}>

<Sidebar />

<div style={{
flex: 1,
display: "flex",
flexDirection: "column",
minHeight: "100vh"
}}>

<Header />

<main style={{
padding: "30px",
background: "linear-gradient(to bottom, #020617, #020617)",
flex: 1
}}>
{children}
</main>

</div>
</div>
)
}