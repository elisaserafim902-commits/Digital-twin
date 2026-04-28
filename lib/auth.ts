import CredentialsProvider from "next-auth/providers/ credentials"
import bcrypt from "bcrypt"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const authOptions = {
providers: [
CredentialsProvider({
name: "Credentials",

credentials:{
email:{},
password:{}
},

async authorize(credentials:any){

const user = await prisma.user.findUnique({
where:{ email: credentials.email }
})

if(!user) return null

const valid = await bcrypt.compare(
credentials.password,
user.password
)

if(!valid) return null

return {
id: user.id ,
email:user.email
}
}
})
],

session:{
strategy:"jwt"
},

secret: process.env.NEXTAUTH_SECRET
}