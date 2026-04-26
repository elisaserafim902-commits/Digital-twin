import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export async function POST(req: Request){

const body = await req.json()

const hashed = await bcrypt.hash(body.password,10)

const company = await prisma.company.create({
data:{
name: body.company
}
})

const user = await prisma.user.create({
data:{
email: body.email,
password: hashed,
companyId: company.id
}
})

return Response.json({
success:true,
user
})
}