import "./globals.css"
import Link from "next/link"

export default function RootLayout({
children,
}: {
children: React.ReactNode
}) {
return (
<html>
<body style={{margin:0,fontFamily:"Arial"}}>

<div style={{display:"flex",height:"100vh"}}>

{/* Sidebar */}

<div style={{
width:220,
background:"#111",
color:"#fff",
padding:20
}}>

<h2>Digital Twin</h2>

<nav style={{display:"flex",flexDirection:"column",gap:10}}>

<Link href="/" style={{color:"#fff"}}>Dashboard</Link>
<Link href="/memory" style={{color:"#fff"}}>Memory</Link>
<Link href="/projects" style={{color:"#fff"}}>Projects</Link>
<Link href="/tasks" style={{color:"#fff"}}>Tasks</Link>
<Link href="/timeline" style={{color:"#fff"}}>Timeline</Link>

</nav>

</div>

{/* Conteúdo */}

<div style={{
flex:1,
padding:40,
background:"#f5f5f5"
}}>
{children}
</div>

</div>

</body>
</html>
)
}