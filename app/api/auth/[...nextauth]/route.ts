import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
providers: [
CredentialsProvider({
name: "Credentials",
credentials: {},
async authorize() {
return { id: "1", name: "User" }
},
}),
],
})

export { handler as GET, handler as POST }