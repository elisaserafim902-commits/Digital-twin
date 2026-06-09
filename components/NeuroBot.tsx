mkdir components
notepad components\NeuroBot.tsx

"use client"

export default function NeuroBot() {
return (
<div className="flex flex-col items-center">
<img
src="/neurobot.png"
alt="NeuroBot"
className="w-80 animate-pulse"
/>

<div className="mt-6 bg-blue-950 border border-cyan-500 rounded-xl p-4 max-w-md">
<h3 className="text-cyan-400 font-bold">
Olá, sou o NeuroBot 🤖
</h3>

<p className="text-gray-300 mt-2">
Sou seu assistente inteligente.
Posso explicar cada área da plataforma,
monitorar dados e guiá-lo em todas as funções.
</p>
</div>
</div>
)
}