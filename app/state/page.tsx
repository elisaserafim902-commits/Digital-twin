"use client"

import { useEffect, useState } from "react"

export default function State(){

const [state,setState] = useState<any>({})

async function carregar(){

const res = await fetch("/api/state")
const data = await res.json()

setState(data)

}

useEffect(()=>{
carregar()
},[])

return(

<div style={{padding:40}}>

<h1>Life State</h1>

<p>Estado atual do Digital Twin</p>

<ul>

<li>Energia: {state.energia}</li>
<li>Foco: {state.foco}</li>
<li>Projetos ativos: {state.projetos}</li>
<li>Risco: {state.risco}</li>

</ul>

</div>

)

}