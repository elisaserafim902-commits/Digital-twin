"use client"

import { useState } from "react"

export default function Dashboard() {

const [message, setMessage] = useState("")
const [reply, setReply] = useState("")

async function sendMessage() {

const res = await fetch("/api/neurobot", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
message,
}),
})

const data = await res.json()

setReply(data.reply)
}

return (
<div className="min-h-screen bg-black text-white p-10">

<h1 className="text-5xl font-bold mb-10">
NeuroTwin Dashboard
</h1>

<div className="bg-zinc-900 p-6 rounded-xl">

<h2 className="text-3xl font-bold mb-4">
NeuroBot Online
</h2>

<textarea
className="w-full p-4 text-black rounded-lg"
rows={5}
placeholder="Faça uma pergunta..."
onChange={(e)=>setMessage(e.target.value)}
/>

<button
onClick={sendMessage}
className="bg-blue-600 px-6 py-3 rounded-lg mt-4"
>
Enviar
</button>

<div className="mt-8 bg-zinc-800 p-6 rounded-lg">
<h3 className="text-xl font-bold mb-2">
Resposta da IA
</h3>

<p>{reply}</p>
</div>

</div>

</div>
)
}