import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { authenticate } from "@/lib/auth"

const handler = NextAuth({
providers: [
CredentialsProvider({
name: "Credentials",
credentials: {},

async authorize(credentials) {
const user = await authenticate(
credentials?.email || "",
credentials?.password || ""
)

if (!user) return null

return user
}
})
],
session: {
strategy: "jwt"
}
})

export { handler as GET, handler as POST }