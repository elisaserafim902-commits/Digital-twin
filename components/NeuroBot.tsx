"use client"

import { useState, useEffect } from "react"

export default function NeuroBot() {
const mensagens = [
"Bem-vindo à NeuroTwin.",
"Sou o NeuroBot.",
"Posso guiá-lo por todo o sistema.",
"Monitorando ambiente em tempo real."
]

const [texto, setTexto] = useState("")

useEffect(() => {
let i = 0

const intervalo = setInterval(() => {
setTexto(mensagens[i])
i++

if (i >= mensagens.length) {
i = 0
}
}, 4000)

return () => clearInterval(intervalo)
}, [])

return (
<div className="flex flex-col items-center justify-center">
<div className="text-8xl mb-4">
🤖
</div>

<h2 className="text-cyan-400 text-xl font-bold">
NeuroBot
</h2>

<p className="text-center text-gray-300 mt-4 max-w-md">
{texto}
</p>
</div>
)
}