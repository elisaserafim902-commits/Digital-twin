"use client"

import { useState, useEffect } from "react"

export default function ProjectsPage(){

const [name,setName] = useState("")
const [projects,setProjects] = useState<any[]>([])

async function loadProjects(){
const res = await fetch("/api/projects")
const data = await res.json()
setProjects(data)
}

useEffect(()=>{
loadProjects()
},[])

async function createProject(e:any){
e.preventDefault()

await fetch("/api/projects",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
name
})
})

setName("")
loadProjects()
}

return(

<div style={{padding:"40px"}}>

<h1>Projects</h1>

<form onSubmit={createProject}>

<input
value={name}
onChange={(e)=>setName(e.target.value)}
placeholder="Novo projeto"
style={{padding:"10px",marginRight:"10px"}}
/>

<button type="submit">
Criar
</button>

</form>

<div style={{marginTop:"30px"}}>

{projects.map((project)=>(
<div key={project.id} style={{marginBottom:"10px"}}>
• {project.name}
</div>
))}

</div>

</div>
)
}