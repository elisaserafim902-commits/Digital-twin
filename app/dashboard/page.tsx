"use client"

import { useEffect, useState } from "react"

export default function Dashboard(){

const [strategy,setStrategy] = useState<any>(null)

useEffect(()=>{

fetch("/api/strategy")
.then(res=>res.json())
.then(data=>setStrategy(data))

},[])

return(

<div className="twin-container">

<h1 className="title">
DIGITAL TWIN CONTROL CENTER
</h1>

<p className="subtitle">
Sistema operacional estratégico da vida
</p>

<div className="grid">

<div className="card">
<h3>Estado do Twin</h3>
<p>Projetos ativos: {strategy?.activeProjects ?? "-"}</p>
<p>Tarefas abertas: {strategy?.openTasks ?? "-"}</p>
<p>Memórias: {strategy?.memories ?? "-"}</p>
</div>

<div className="card">
<h3>Prioridade do Dia</h3>
<p>{strategy?.priority ?? "analisando..."}</p>
</div>

<div className="card">
<h3>Status Estratégico</h3>
<p>Energia: {strategy?.energy ?? "-"}</p>
<p>{strategy?.recommendation ?? "analisando..."}</p>
</div>

</div>

<div className="radar">

<h3>Radar Estratégico</h3>
<div className="ai-radar">

<div className="radar-circle">
<div className="radar-scan"></div>
</div>

<p className="radar-text">
Twin Brain ativo • análise estratégica em execução
</p>

</div>


<p>
O Digital Twin está analisando padrões da sua vida e decisões recentes.
</p>

<p className="highlight">
Recomendação: mantenha foco no projeto principal.
</p>

</div>

<style jsx>{`
.ai-radar{
margin-top:50px;
display:flex;
flex-direction:column;
align-items:center;
}

.radar-circle{
width:220px;
height:220px;
border-radius:50%;
border:2px solid #38bdf8;
position:relative;
overflow:hidden;
box-shadow:0 0 30px rgba(56,189,248,0.3);
}

.radar-scan{
width:100%;
height:100%;
position:absolute;
background:conic-gradient(
rgba(56,189,248,0.8),
transparent 60%
);
animation:radar 4s linear infinite;
}

@keyframes radar{
from{
transform:rotate(0deg)
}
to{
transform:rotate(360deg)
}
}

.radar-text{
margin-top:15px;
color:#38bdf8;
font-size:14px;
letter-spacing:1px;
}

.twin-container{
min-height:100vh;
padding:40px;
background:radial-gradient(circle at top,#020617,#020617,#000);
color:white;
font-family:system-ui;
}

.title{
font-size:30px;
letter-spacing:2px;
color:#38bdf8;
margin-bottom:5px;
}

.subtitle{
color:#94a3b8;
margin-bottom:40px;
}

.grid{
display:grid;
grid-template-columns:repeat(3,1fr);
gap:20px;
}

.card{
background:#020617;
border:1px solid #0ea5e9;
padding:25px;
border-radius:12px;
box-shadow:0 0 25px rgba(14,165,233,0.2);
transition:0.3s;
}

.card:hover{
transform:scale(1.02);
box-shadow:0 0 35px rgba(14,165,233,0.4);
}

.radar{
margin-top:40px;
padding:30px;
border-radius:12px;
border:1px solid #38bdf8;
background:#020617;
box-shadow:0 0 30px rgba(56,189,248,0.15);
}

.highlight{
margin-top:10px;
color:#22c55e;
}

`}</style>

</div>

)

}