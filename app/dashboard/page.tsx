import { getServerSession } from "next-auth"

export default async function Dashboard() {
const session = await getServerSession()

if (!session) {
return <div>Não autenticado</div>
}

return (
<div className="p-10 text-white">
<h1 className="text-2xl">Dashboard</h1>

<p>Email: {session.user?.email}</p>
<p>Empresa ID: {session.user?.companyId}</p>
</div>
)
}