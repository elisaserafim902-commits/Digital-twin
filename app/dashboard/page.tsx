
export default function Dashboard() {
return (
<main className="min-h-screen bg-[#020617] text-white p-10">

<h1 className="text-5xl font-bold mb-10">
🤖 NeuroTwin Command Center
</h1>

<div className="grid grid-cols-4 gap-6">

<div className="bg-slate-900 p-6 rounded-xl">
<h3>Produção</h3>
<p className="text-4xl text-cyan-400">98%</p>
</div>

<div className="bg-slate-900 p-6 rounded-xl">
<h3>IA Ativa</h3>
<p className="text-4xl text-green-400">ONLINE</p>
</div>

<div className="bg-slate-900 p-6 rounded-xl">
<h3>Sensores</h3>
<p className="text-4xl text-yellow-400">2847</p>
</div>

<div className="bg-slate-900 p-6 rounded-xl">
<h3>Eficiência</h3>
<p className="text-4xl text-cyan-400">94%</p>
</div>

</div>

</main>
)
}