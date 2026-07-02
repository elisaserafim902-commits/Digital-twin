"use client"

import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition"

export default function Dashboard() {
const {
transcript,
listening,
resetTranscript
} = useSpeechRecognition()

function falar(texto: string) {
const voz = new SpeechSynthesisUtterance(texto)
voz.lang = "pt-BR"
voz.rate = 1
window.speechSynthesis.speak(voz)
}

async function ouvir() {
if (listening) {
SpeechRecognition.stopListening()

const resposta = "Entendido, Elisa. Estou analisando sua solicitação: " + transcript
falar(resposta)

} else {
resetTranscript()

SpeechRecognition.startListening({
continuous: true,
language: "pt-BR"
})
}
}

return (
<main className="min-h-screen bg-black text-white flex flex-col items-center justify-center">

<h1 className="text-6xl font-bold mb-4">
NeuroTwin 2050
</h1>

<p className="mb-10 text-blue-300">
NeuroBot Online • Comando de voz ativo
</p>

<button
onClick={ouvir}
className="w-56 h-56 rounded-full bg-blue-600 text-8xl shadow-[0_0_90px_#2563eb]"
>
🎙️
</button>

<h2 className="mt-8 text-3xl">
{listening ? "Estou ouvindo..." : "Toque para falar"}
</h2>

<p className="mt-8 text-2xl max-w-4xl text-center">
{transcript}
</p>

</main>
)
}
