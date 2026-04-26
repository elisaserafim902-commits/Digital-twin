import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { authenticate } from "@/lib/auth"

export const authOptions = {
providers: [
CredentialsProvider({
name: "credentials",

credentials: {
email: {},
password: {}
},

async authorize(credentials) {
if (!credentials) return null

return await authenticate(
credentials.email,
credentials.password
)
}
})
],

session: {
strategy: "jwt"
},

secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }