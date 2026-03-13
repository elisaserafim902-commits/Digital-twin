"use client"

import { useEffect, useState } from "react"

export default function Timeline(){

const [timeline,setTimeline] = useState<any[]>([])

const [titulo,setTitulo] = useState("")
const [descricao,setDescricao] = useState("")
const [tipo,setTipo] = useState("evento")
const [data,setData] = useState("")
const [impacto,setImpacto] = useState("medio")

async function carregar(){

const res = await fetch("/api/timeline")
const data = await res.json()

setTimeline(data)

}

useEffect(()=>{
carregar()
},[])

async function salvar(e:any){

e.preventDefault()

await fetch("/api/timeline",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
titulo,
descricao,
tipo,
data,
impacto
})
})

setTitulo("")
setDescricao("")

carregar()

}

return(

<div style={{padding:40}}>

<h1>Life Timeline</h1>

<form onSubmit={salvar}>

<input
placeholder="Título"
value={titulo}
onChange={(e)=>setTitulo(e.target.value)}
/>

<br/><br/>

<input
placeholder="Descrição"
value={descricao}
onChange={(e)=>setDescricao(e.target.value)}
/>

<br/><br/>

<input
placeholder="Data"
value={data}
onChange={(e)=>setData(e.target.value)}
/>

<br/><br/>

<select
value={tipo}
onChange={(e)=>setTipo(e.target.value)}
>

<option value="evento">Evento</option>
<option value="decisao">Decisão</option>
<option value="projeto">Projeto</option>
<option value="aprendizado">Aprendizado</option>

</select>

<br/><br/>

<select
value={impacto}
onChange={(e)=>setImpacto(e.target.value)}
>

<option value="baixo">Baixo</option>
<option value="medio">Médio</option>
<option value="alto">Alto</option>

</select>

<br/><br/>

<button type="submit">

Adicionar Evento

</button>

</form>

<br/>

<h2>Timeline</h2>

<ul>

{timeline.map((t)=>(
<li key={t.id}>
<strong>{t.data}</strong> — {t.titulo} ({t.tipo})
</li>
))}

</ul>

</div>

)

}