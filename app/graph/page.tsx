notepad app\graph\page.tsx


"use client"

import { useEffect, useState } from "react"

export default function Graph(){

const [links,setLinks] = useState<any[]>([])

async function carregar(){

const res = await fetch("/api/graph")
const data = await res.json()

setLinks(data)

}

useEffect(()=>{
carregar()
},[])

return(

<div style={{padding:40}}>

<h1>Twin Graph</h1>

<p>Relações da vida registradas pelo Twin.</p>

<ul>

{links.map((l)=>(
<li key={l.id}>
{l.origem} → {l.destino} ({l.tipo})
</li>
))}

</ul>

</div>

)

}