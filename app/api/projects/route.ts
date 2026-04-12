import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(req: Request) {
try {
const session = await getServerSession(authOptions)

if (!session || !session.user) {
return Response.json({ error: "Não autorizado" }, { status: 401 })
}

const { name } = await req.json()

if (!name) {
return Response.json({ error: "Nome obrigatório" }, { status: 400 })
}

const project = await prisma.project.create({
data: {
name,
companyId: session.user.companyId
}
})

return Response.json(project)

} catch (error) {
console.error(error)
return Response.json({ error: "Erro interno" }, { status: 500 })
}
}