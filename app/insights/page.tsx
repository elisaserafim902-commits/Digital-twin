"use client"

import { useEffect, useState } from "react"

export default function Insights(){

const [insights,setInsights] = useState<any[]>([])

async function carregar(){

const res = await fetch("/api/analysis")
const data = await res.json()

setInsights(data)

}

useEffect(()=>{
carregar()
},[])

return(

<div style={{padding:40}}>

<h1>Insights do Twin</h1>

<ul>

{insights.map((i)=>(
<li key={i.id}>
{i.texto}
</li>
))}

</ul>

</div>

)

}