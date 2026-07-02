"use client"

import { useState } from "react"

export default function NeuroBot() {
const [message, setMessage] = useState("")
const [response, setResponse] = useState(
"Olá Elisa. Sou o NeuroBot."
)

async function sendMessage() {
if (!message) return

setResponse("Analisando...")

try {
const res = await fetch("/api/chat", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
message,
}),
})

const data = await res.json()

setResponse(data.answer)
} catch {
setResponse("Erro ao conectar.")
}
}

return (
<div
style={{
background: "#111827",
padding: "20px",
borderRadius: "20px",
marginBottom: "30px",
}}
>
<h2>🤖 NeuroBot</h2>

<p>{response}</p>

<input
value={message}
onChange={(e) => setMessage(e.target.value)}
placeholder="Faça uma pergunta..."
style={{
width: "100%",
padding: "12px",
marginTop: "10px",
borderRadius: "10px",
}}
/>

<button
onClick={sendMessage}
style={{
marginTop: "10px",
padding: "10px 20px",
borderRadius: "10px",
}}
>
Enviar
</button>
</div>
)
}