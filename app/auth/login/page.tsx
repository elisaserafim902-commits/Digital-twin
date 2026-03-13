"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { login } from "../../lib/auth"

export default function Login(){

const router = useRouter()

const [email,setEmail] = useState("")
const [senha,setSenha] = useState("")

function handleLogin(e:any){

e.preventDefault()

login()

router.push("/dashboard")

}

return(

<div style={{padding:40}}>

<h1>Login</h1>

<form onSubmit={handleLogin}>

<input
placeholder="email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<br/><br/>

<input
type="password"
placeholder="senha"
value={senha}
onChange={(e)=>setSenha(e.target.value)}
/>

<br/><br/>

<button type="submit">

Entrar

</button>

</form>

</div>

)

}