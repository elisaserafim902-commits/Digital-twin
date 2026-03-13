"use client"

import { useEffect, useState } from "react"

export default function Twin(){

const [analysis,setAnalysis] = useState<any[]>([])

async function carregar(){

const res = await fetch("/api/twin")
const data = await res.json()

setAnalysis(data)

}

useEffect(()=>{
carregar()
},[])

return(

<div style={{padding:40}}>

<h1>Twin Brain</h1>

<p>Análises estratégicas do Digital Twin.</p>

<ul>

{analysis.map((a)=>(
<li key={a.id}>
{a.analise}
</li>
))}

</ul>

</div>

)

}