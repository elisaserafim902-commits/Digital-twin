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
},

callbacks: {
async jwt({ token, user }) {
if (user) {
token.id = user.id
token.email = user.email
token.companyId = user.companyId
}
return token
},

async session({ session, token }) {
if (session.user) {
session.user.id = token.id as string
session.user.email = token.email as string
session.user.companyId = token.companyId as string
}
return session
}
}
})

export { handler as GET, handler as POST }