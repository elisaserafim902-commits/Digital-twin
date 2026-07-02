import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export async function POST(req: Request) {
try {
const body = await req.json()

const { email, password, company } = body

const existingUser = await prisma.user.findUnique({
where: { email }
})

if (existingUser) {
return NextResponse.json(
{ error: "Usuário já existe" },
{ status: 400 }
)
}

const hashedPassword = await bcrypt.hash(password, 10)

const newCompany = await prisma.company.create({
data: {
name: company
}
})

const user = await prisma.user.create({
data: {
email,
password: hashedPassword,
companyId: newCompany.id
}
})

return NextResponse.json(user)

} catch (error) {
console.log(error)

return NextResponse.json(
{ error: "Erro interno" },
{ status: 500 }
)
}
}