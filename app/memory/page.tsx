"use client"

import { useState, useEffect } from "react"

export default function MemoryPage(){

const [content,setContent] = useState("")
const [memory,setMemory] = useState<any[]>([])

async function loadMemory(){
const res = await fetch("/api/memory")
const data = await res.json()
setMemory(data)
}

useEffect(()=>{
loadMemory()
},[])

async function saveMemory(e:any){
e.preventDefault()

await fetch("/api/memory",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
content
})
})

setContent("")
loadMemory()
}

return(

<div style={{padding:"40px"}}>

<h1>Memory</h1>

<form onSubmit={saveMemory}>

<input
value={content}
onChange={(e)=>setContent(e.target.value)}
placeholder="Registrar memória..."
style={{padding:"10px",marginRight:"10px",width:"300px"}}
/>

<button type="submit">
Salvar
</button>

</form>

<div style={{marginTop:"30px"}}>

{memory.map((item)=>(
<div key={item.id} style={{marginBottom:"10px"}}>
• {item.content}
</div>
))}

</div>

</div>
)
}