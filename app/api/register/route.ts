import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export async function POST(req: Request) {
try {
const { email, password, companyName } = await req.json()

if (!email || !password || !companyName) {
return Response.json({ error: "Dados inválidos" }, { status: 400 })
}

// verifica se usuário já existe
const existingUser = await prisma.user.findUnique({
where: { email }
})

if (existingUser) {
return Response.json({ error: "Usuário já existe" }, { status: 400 })
}

// hash da senha
const hashedPassword = await bcrypt.hash(password, 10)

// cria empresa
const company = await prisma.company.create({
data: {
name: companyName
}
})

// cria usuário vinculado à empresa
const user = await prisma.user.create({
data: {
email,
password: hashedPassword,
companyId: company.id
}
})

return Response.json({ success: true, user })

} catch (error) {
console.error(error)
return Response.json({ error: "Erro interno" }, { status: 500 })
}
}