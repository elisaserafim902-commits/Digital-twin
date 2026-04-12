import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export default async function Dashboard() {
const session = await getServerSession(authOptions)

// 🔒 proteção server-side
if (!session || !session.user) {
return <div>Não autenticado</div>
}

const companyId = session.user.companyId

// 🔥 busca isolada por empresa (multi-tenant real)
const projects = await prisma.project.findMany({
where: {
companyId: companyId
}
})

return (
<div className="p-10 text-white">
<h1 className="text-2xl mb-4">Dashboard</h1>

<p>Email: {session.user.email}</p>
<p>Empresa ID: {companyId}</p>

<div className="mt-6">
<h2 className="text-xl mb-2">Projetos</h2>

{projects.length === 0 ? (
<p>Nenhum projeto encontrado</p>
) : (
<ul>
{projects.map((project) => (
<li key={project.id}>
{project.name}
</li>
))}
</ul>
)}
</div>
</div>
)
}