"use client"

import { useEffect, useState } from "react"

export default function Home() {

const [strategy,setStrategy] = useState<any>(null)

useEffect(()=>{

fetch("/api/strategy")
.then(res=>res.json())
.then(data=>setStrategy(data))

},[])

return(

<main className="container">

<div className="sidebar">

<h2>Digital Twin</h2>

<nav>

<p><a href="/">Dashboard</a></p>
<p><a href="/memory">Memory</a></p>
<p><a href="/projects">Projects</a></p>
<p><a href="/tasks">Tasks</a></p>

</nav>

</div>

<div className="content">

<h1>Digital Twin Control Center</h1>
<p>Sistema estratégico da vida</p>

<div className="cards">

<div className="card">

<h3>Estado do Twin</h3>

<p>Projetos ativos: {strategy?.activeProjects || 0}</p>
<p>Tarefas abertas: {strategy?.openTasks || 0}</p>
<p>Energia estimada: {strategy?.energy || "média"}</p>

</div>

<div className="card">

<h3>Prioridade do Dia</h3>

<p>{strategy?.priorityToday || "Nenhuma tarefa registrada"}</p>
<p>Foco: {strategy?.focus || "Organização"}</p>

</div>

<div className="card">

<h3>Status do Sistema</h3>

<p>Banco conectado</p>
<p>Memória ativa</p>
<p>Digital Twin operacional</p>

</div>

</div>

</div>

<style jsx>{`

.container{
display:flex;
height:100vh;
font-family:Segoe UI;
background:radial-gradient(circle at top,#020617,#01010f);
color:white;
overflow:hidden;
}

.sidebar{
width:250px;
background:linear-gradient(180deg,#01010f,#020617);
padding:30px;
border-right:1px solid rgba(56,189,248,0.2);
box-shadow:0 0 30px rgba(56,189,248,0.1);
}

.sidebar h2{
color:#38bdf8;
margin-bottom:25px;
letter-spacing:1px;
}

.sidebar a{
color:#cbd5f5;
text-decoration:none;
}

.sidebar p{
margin:12px 0;
padding:8px 12px;
border-radius:6px;
transition:0.25s;
}

.sidebar p:hover{
background:rgba(56,189,248,0.15);
transform:translateX(5px);
}

.content{
flex:1;
padding:50px;
background:radial-gradient(circle at center,#0f172a,#020617);
}

.content h1{
color:#38bdf8;
letter-spacing:1px;
text-shadow:0 0 12px rgba(56,189,248,0.5);
}

.cards{
display:flex;
gap:25px;
margin-top:40px;
}

.card{
background:rgba(15,23,42,0.7);
backdrop-filter:blur(8px);
padding:25px;
border-radius:14px;
width:280px;
border:1px solid rgba(56,189,248,0.25);
box-shadow:
0 0 20px rgba(56,189,248,0.15),
inset 0 0 20px rgba(56,189,248,0.05);
transition:0.3s;
}

.card:hover{
transform:translateY(-6px);
box-shadow:
0 0 30px rgba(56,189,248,0.35),
inset 0 0 30px rgba(56,189,248,0.1);
}

.card h3{
color:#38bdf8;
margin-bottom:10px;
letter-spacing:0.5px;
}

.card p{
color:#cbd5f5;
margin:6px 0;
font-size:14px;
}

`}</style>

</main>

)

}