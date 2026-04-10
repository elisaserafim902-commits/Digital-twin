import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { authenticate } from "@/lib/auth"

const handler = NextAuth({
providers: [
CredentialsProvider({
name: "Credentials",
credentials: {
email: {},
password: {}
},
async authorize(credentials) {
if (!credentials?.email || !credentials?.password) {
return null
}

const user = await authenticate(
credentials.email,
credentials.password
)

if (!user) return null

return user
}
})
],
session: {
strategy: "jwt"
},
pages: {
signIn: "/login"
}
})

export { handler as GET, handler as POST }