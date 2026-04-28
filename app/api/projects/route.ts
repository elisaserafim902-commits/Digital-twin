import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
const session = await getServerSession(authOptions)

if (!session) {
return Response.json({ error:"Unauthorized" }, { status:401 })
}

const body = await req.json()

const project = await prisma.project.create({
data:{
name: body.name,
companyId: body.companyId
}
})

return Response.json(project)
}
