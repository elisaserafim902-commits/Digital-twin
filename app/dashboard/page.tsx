import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { authOptions } from "@/lib/auth"

export default async function DashboardPage() {
const session = await getServerSession(authOptions)

if (!session) {
redirect("/login")
}

return (
<div style={{padding:"40px"}}>
<h1>NeuroTwin Dashboard</h1>

<p>Produção: 87%</p>
<p>Eficiência: +12.4%</p>

<p>
Usuário: {session.user?.email}
</p>
</div>
)
}