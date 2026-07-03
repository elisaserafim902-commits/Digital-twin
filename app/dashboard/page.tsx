"use client"

import { useState } from "react"
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition"

export default function Dashboard() {
const { transcript, listening, resetTranscript } = useSpeechRecognition()
const [resposta, setResposta] = useState("Toque no microfone e fale comigo.")

function falar(texto: string) {
const voz = new SpeechSynthesisUtterance(texto)
voz.lang = "pt-BR"
voz.rate = 1.05
voz.pitch = 1
window.speechSynthesis.cancel()
window.speechSynthesis.speak(voz)
}

function responder(pergunta: string) {
const p = pergunta.toLowerCase()

let texto = "Entendido, Elisa. Estou pronta para evoluir o NeuroTwin com você."

if (p.includes("clima") || p.includes("previsão")) {
texto = "Elisa, o módulo de clima ainda será conectado em tempo real. Por enquanto, sua voz já está funcionando e eu já consigo responder por áudio."
}

if (p.includes("oportunidade")) {
texto = "Detectei busca por oportunidades. O próximo módulo será o radar de tendências, negócios e investimentos."
}

if (p.includes("relatório")) {
texto = "Posso gerar relatórios automáticos assim que conectarmos banco de dados, memória e fontes externas."
}

setResposta(texto)
falar(texto)
}

function alternarVoz() {
if (listening) {
SpeechRecognition.stopListening()
setTimeout(() => responder(transcript), 400)
} else {
resetTranscript()
setResposta("Estou ouvindo...")
SpeechRecognition.startListening({
continuous: true,
language: "pt-BR",
})
}
}

return (
<main className="min-h-screen bg-[#020617] text-white overflow-hidden">
<div className="grid grid-cols-[260px_1fr_360px] min-h-screen">

<aside className="bg-[#030712]/90 border-r border-blue-900/40 p-6">
<h1 className="text-3xl font-bold">
NeuroTwin <span className="text-blue-400">2050</span>
</h1>

<p className="text-sm text-slate-400 mb-10">
Sistema Neural Ativo
</p>

<nav className="space-y-5 text-slate-300 text-lg">
<p className="text-blue-400 font-bold">Início</p>
<p>Observatório</p>
<p>Tendências</p>
<p>Oportunidades</p>
<p>Relatórios</p>
<p>NeuroBot</p>
<p>Configurações</p>
</nav>

<div className="absolute bottom-6 text-sm text-slate-500">
Modo Experimento Privado
</div>
</aside>

<section className="relative flex flex-col items-center justify-center p-10">
<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1d4ed855,transparent_45%)]" />

<div className="relative z-10 text-center max-w-4xl">
<h2 className="text-5xl font-bold mb-2">
Olá, Elisa 👋
</h2>

<p className="text-blue-300 mb-8 text-xl">
Eu sou seu NeuroBot 2050. Pode falar comigo.
</p>

<div className="mx-auto w-80 h-80 rounded-full bg-gradient-to-b from-blue-500/30 to-purple-700/20 border border-blue-400/40 shadow-[0_0_110px_#2563eb] flex items-center justify-center animate-pulse">
<div className="w-56 h-56 rounded-full bg-black border border-blue-400/60 flex items-center justify-center text-8xl shadow-[0_0_90px_#3b82f6]">
🤖
</div>
</div>

<div className="mt-8 bg-[#020617]/90 border border-blue-900/60 rounded-2xl p-6">
<p className="text-slate-400">Você disse:</p>
<p className="text-xl text-blue-300 min-h-[32px]">
{transcript || "Aguardando comando de voz..."}
</p>

<p className="mt-5 text-slate-400">Resposta:</p>
<p className="text-xl min-h-[40px]">
{resposta}
</p>
</div>

<button
onClick={alternarVoz}
className="mt-8 w-32 h-32 rounded-full bg-blue-600 hover:bg-blue-500 shadow-[0_0_90px_#2563eb] flex items-center justify-center mx-auto text-6xl"
>
🎙️
</button>

<h3 className="mt-5 text-3xl font-bold text-blue-400">
{listening ? "Estou ouvindo..." : "Toque para falar"}
</h3>
</div>
</section>

<aside className="bg-[#030712]/90 border-l border-blue-900/40 p-6 space-y-5">
<div className="bg-[#0f172a] rounded-2xl p-5 border border-blue-900/50">
<h2 className="text-xl font-bold">Neuro IA 2050</h2>
<p className="text-4xl font-bold mt-3 text-blue-400">99.7%</p>
<p className="text-slate-400 text-sm">Nível de evolução</p>
</div>

<div className="bg-[#0f172a] rounded-2xl p-5 border border-blue-900/50">
<h2 className="text-xl font-bold">🌍 Observatório Global</h2>
<p className="text-slate-400">12 fontes ativas</p>
</div>

<div className="bg-[#0f172a] rounded-2xl p-5 border border-blue-900/50">
<h2 className="text-xl font-bold">📈 Tendências</h2>
<p>IA Generativa +98%</p>
<p>Energia Limpa +76%</p>
<p>Biotecnologia +66%</p>
</div>

<div className="bg-[#0f172a] rounded-2xl p-5 border border-blue-900/50">
<h2 className="text-xl font-bold">💼 Oportunidades</h2>
<p>24 oportunidades detectadas</p>
</div>

<div className="bg-[#0f172a] rounded-2xl p-5 border border-blue-900/50">
<h2 className="text-xl font-bold">📄 Relatórios</h2>
<p>Análises geradas pelo sistema</p>
</div>
</aside>

</div>
</main>
)
}