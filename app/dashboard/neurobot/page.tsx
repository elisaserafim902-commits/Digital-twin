"use client"

import { useState } from "react"

export default function NeuroBotPage() {
const [pergunta, setPergunta] = useState("")
const [resposta, setResposta] = useState("")

async function analisar() {
if (!pergunta) return

const respostaApi = await fetch("/api/chat", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
message: pergunta,
}),
})

const data = await respostaApi.json()

setResposta(data.answer)
}

return (
<main className="min-h-screen bg-[#020617] text-white p-10">
<h1 className="text-5xl font-bold mb-8">
🤖 NeuroBot Core
</h1>

<p className="mb-6 text-gray-400">
Pergunte qualquer coisa ao NeuroBot.
</p>

<textarea
value={pergunta}
onChange={(e) => setPergunta(e.target.value)}
placeholder="Digite sua pergunta..."
className="w-full p-4 rounded-lg text-black mb-4"
rows={5}
/>

<button
onClick={analisar}
className="bg-blue-600 px-6 py-3 rounded-lg"
>
Analisar
</button>

{resposta && (
<div className="mt-8 bg-slate-900 p-6 rounded-xl">
<h2 className="text-2xl font-bold mb-4">
Resposta
</h2>

<pre className="whitespace-pre-wrap">
{resposta}
</pre>
</div>
)}
</main>
)
}