"use client"

import { useEffect, useState } from "react"

type Task = {
id: string
title: string
status: string
}

export default function Home() {
const [tasks, setTasks] = useState<Task[]>([])
const [title, setTitle] = useState("")

// 🔹 carregar tarefas
async function loadTasks() {
const res = await fetch("/api/tasks")
const data = await res.json()
setTasks(data)
}

useEffect(() => {
loadTasks()
}, [])

// 🔹 criar tarefa
async function createTask() {
if (!title) return

await fetch("/api/tasks", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
title,
}),
})

setTitle("")
loadTasks()
}

// 🔹 deletar
async function deleteTask(id: string) {
await fetch("/api/tasks", {
method: "DELETE",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({ id }),
})

loadTasks()
}

// 🔹 atualizar status
async function toggleStatus(task: Task) {
await fetch("/api/tasks", {
method: "PUT",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
id: task.id,
title: task.title,
status: task.status === "pending" ? "done" : "pending",
}),
})

loadTasks()
}

return (
<main style={{ padding: 20 }}>
<h1>🚀 Digital Twin Tasks</h1>

{/* criar */}
<div style={{ marginBottom: 20 }}>
<input
value={title}
onChange={(e) => setTitle(e.target.value)}
placeholder="Nova tarefa"
/>
<button onClick={createTask}>Criar</button>
</div>

{/* lista */}
<ul>
{tasks.map((task) => (
<li key={task.id} style={{ marginBottom: 10 }}>
<span
style={{
textDecoration:
task.status === "done" ? "line-through" : "none",
marginRight: 10,
}}
>
{task.title}
</span>

<button onClick={() => toggleStatus(task)}>
{task.status === "pending" ? "Concluir" : "Reabrir"}
</button>

<button onClick={() => deleteTask(task.id)}>Excluir</button>
</li>
))}
</ul>
</main>
)
}