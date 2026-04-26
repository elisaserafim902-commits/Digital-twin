import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function DashboardPage() {
const session = await getServerSession(authOptions)
if (!session) redirect("/login")

return (
<div>
<h1>NeuroTwin Dashboard</h1>
<p>Produ‡Æo: 87%%</p>
<p>Eficiˆncia: +12.4%%</p>
<p>{session.user?.email}</p>
</div>
)
}
