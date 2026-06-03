export default function Dashboard() {
return (
<div className="min-h-screen p-8">
<h1 className="text-3xl font-bold mb-6">
Dashboard Digital Twin
</h1>

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

<div className="bg-gray-800 p-6 rounded-xl shadow">
<h2 className="text-xl font-semibold">Usuários</h2>
<p className="text-3xl mt-2">128</p>
</div>

<div className="bg-gray-800 p-6 rounded-xl shadow">
<h2 className="text-xl font-semibold">Projetos</h2>
<p className="text-3xl mt-2">32</p>
</div>

<div className="bg-gray-800 p-6 rounded-xl shadow">
<h2 className="text-xl font-semibold">Atividade</h2>
<p className="text-3xl mt-2">Online</p>
</div>

</div>

<div className="mt-10 bg-gray-900 p-6 rounded-xl">
<h2 className="text-xl mb-4">Resumo</h2>
<p>Seu sistema está rodando com sucesso 🚀</p>
</div>
</div>
);
}