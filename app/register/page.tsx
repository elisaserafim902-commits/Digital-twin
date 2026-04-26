"use client"

import { useState } from "react"

export default function Register(){

const [email,setEmail]=useState("")
const [password,setPassword]=useState("")
const [company,setCompany]=useState("")

async function register(){

await fetch("/api/register",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
email,
password,
company
})
})

window.location.href="/login"
}

return(

<div className="min-h-screen flex items-center justify-center">

<div className="p-8 border rounded">

<h1>Crie sua conta SaaS</h1>

<input
placeholder="Empresa"
onChange={(e)=>setCompany(e.target.value)}
/>

<input
placeholder="Email"
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Senha"
onChange={(e)=>setPassword(e.target.value)}
/>

<button onClick={register}>
Criar Conta
</button>

</div>

</div>

)
}