import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export async function authenticate(email: string, password: string) {
try {
const user = await prisma.user.findUnique({
where: { email }
})

if (!user) return null

const valid = await bcrypt.compare(password, user.password)

if (!valid) return null

return {
id: user.id,
email: user.email,
companyId: user.companyId
}
} catch (error) {
console.error("Auth error:", error)
return null
}
}