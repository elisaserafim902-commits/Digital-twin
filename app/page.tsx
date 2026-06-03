export default function Home() {
return (
<main className="min-h-screen bg-[#020617] text-white flex items-center justify-center px-8">
<div className="max-w-7xl w-full grid md:grid-cols-2 gap-12 items-center">

<div className="flex justify-center">
<img
src="/robot-neurobot.png"
alt="NeuroBot"
className="w-[400px]"
/>
</div>

<div>
<h1 className="text-6xl font-bold mb-4">
NeuroTwin Platform
</h1>

<p className="text-xl text-gray-300 mb-8">
Sistema Industrial Inteligente em Tempo Real
</p>

<div className="space-y-3 text-lg mb-10">
<p>✓ Dashboard Inteligente</p>
<p>✓ Digital Twin</p>
<p>✓ IA Preditiva</p>
<p>✓ Automação Industrial</p>
<p>✓ Monitoramento Global</p>
</div>

<a
href="/login"
className="bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-xl text-lg font-semibold"
>
Entrar no Sistema
</a>
</div>

</div>
</main>
)
}