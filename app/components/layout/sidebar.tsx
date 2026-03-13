"use client"

import Link from "next/link"
import { logout } from "../../lib/auth"

export default function Sidebar(){

return(

<div style={{
width:220,
height:"100vh",
background:"#111",
color:"#fff",
padding:20,
position:"fixed"
}}>

<h2>Sistema</h2>

<hr/>

<p><Link href="/dashboard">Dashboard</Link></p>

<p><Link href="/auth/login">Login</Link></p>

<p><Link href="/sobre">Sobre</Link></p>

<hr/>

<p>
<button
onClick={()=>{
logout()
window.location.href="/auth/login"
}}
>
Sair
</button>
</p>

</div>

)

}