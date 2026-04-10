import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export async function POST(req: Request) {
const { email, password, companyName } = await req.json()

if (!email || !password || !companyName) {
return Response.json({ error: "Dados inválidos" }, { status: 400 })
}

const existing = await prisma.user.findUnique({
where: { email }
})

if (existing) {
return Response.json({ error: "Usuário já existe" }, { status: 400 })
}

const hashed = await bcrypt.hash(password, 10)

const company = await prisma.company.create({
data: {
name: companyName
}
})

const user = await prisma.user.create({
data: {
email,
password: hashed,
companyId: company.id
}
})

return Response.json(user)
}