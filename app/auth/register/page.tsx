"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Register(){

const router = useRouter()

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")

async function handleRegister(e:any){

e.preventDefault()

await fetch("/api/users",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
email,
password
})
})

router.push("/auth/login")

}

return(

<div style={{padding:40}}>

<h1>Criar Conta</h1>

<form onSubmit={handleRegister}>

<input
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<br/><br/>

<input
type="password"
placeholder="Senha"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<br/><br/>

<button type="submit">
Cadastrar
</button>

</form>

</div>

)

}