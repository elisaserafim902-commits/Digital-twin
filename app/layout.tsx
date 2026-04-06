export default function Home() {
return (
<main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
<div className="text-center space-y-6">
<h1 className="text-4xl font-bold">
NeuroTwin Platform
</h1>

<p className="text-gray-300">
Sistema industrial inteligente em tempo real
</p>

<a
href="/login"
className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
>
Entrar
</a>
</div>
</main>
)
}