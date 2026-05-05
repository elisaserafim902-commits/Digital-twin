export default function Dashboard() {
return (
<div className="space-y-6">

<h1 className="text-3xl font-bold">Dashboard</h1>

{/* CARDS */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">

<div className="bg-white p-4 rounded shadow">
<h2 className="text-gray-500">Usuários</h2>
<p className="text-2xl font-bold">120</p>
</div>

<div className="bg-white p-4 rounded shadow">
<h2 className="text-gray-500">Projetos</h2>
<p className="text-2xl font-bold">8</p>
</div>

<div className="bg-white p-4 rounded shadow">
<h2 className="text-gray-500">Receita</h2>
<p className="text-2xl font-bold">R$ 12.300</p>
</div>

</div>

{/* TABELA */}
<div className="bg-white p-4 rounded shadow">
<h2 className="text-lg font-bold mb-3">Projetos recentes</h2>

<table className="w-full text-left">
<thead>
<tr className="text-gray-500">
<th>Nome</th>
<th>Status</th>
</tr>
</thead>

<tbody>
<tr>
<td>NeuroTwin</td>
<td className="text-green-500">Ativo</td>
</tr>
<tr>
<td>App IA</td>
<td className="text-yellow-500">Pendente</td>
</tr>
</tbody>
</table>
</div>

</div>
)
}