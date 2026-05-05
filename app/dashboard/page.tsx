export default function Dashboard() {
return (
<div className="space-y-6">

<h1 className="text-3xl font-bold">Painel NeuroTwin</h1>

{/* CARDS */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">

<div className="card">
<p className="text-gray-400">Usuários</p>
<h2 className="text-2xl font-bold">120</h2>
</div>

<div className="card">
<p className="text-gray-400">Projetos</p>
<h2 className="text-2xl font-bold">8</h2>
</div>

<div className="card">
<p className="text-gray-400">Status</p>
<h2 className="text-green-400">Online</h2>
</div>

</div>

{/* BLOCO PRINCIPAL */}
<div className="card">
<h2 className="text-xl font-bold mb-3">Resumo</h2>
<p>Sistema funcionando e pronto para expansão.</p>
</div>

</div>
)
}