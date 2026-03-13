"use client"

import { useState, useEffect } from "react"

export default function TasksPage() {

const [title, setTitle] = useState("")
const [tasks, setTasks] = useState<any[]>([])

async function loadTasks() {
const res = await fetch("/api/tasks")
const data = await res.json()
setTasks(data)
}

useEffect(() => {
loadTasks()
}, [])

async function createTask(e:any) {
e.preventDefault()

await fetch("/api/tasks", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
title
})
})

setTitle("")
loadTasks()
}

return (

<div style={{padding:"40px"}}>

<h1>Tarefas</h1>

<form onSubmit={createTask}>

<input
value={title}
onChange={(e)=>setTitle(e.target.value)}
placeholder="Nova tarefa"
style={{padding:"10px",marginRight:"10px"}}
/>

<button type="submit">
Criar
</button>

</form>

<div style={{marginTop:"30px"}}>

{tasks.map((task)=>(
<div key={task.id} style={{marginBottom:"10px"}}>
• {task.title}
</div>
))}

</div>

</div>

)
}