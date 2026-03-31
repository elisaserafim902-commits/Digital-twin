import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const dynamic = "force-dynamic"

const handler = NextAuth({
providers: [
CredentialsProvider({
name: "Login",
credentials: {
email: { label: "Email", type: "text" },
password: { label: "Senha", type: "password" },
},

async authorize(credentials) {
// 🔥 LOGIN SIMPLES (FAKE)
if (
credentials?.email === "admin@admin.com" &&
credentials?.password === "123456"
) {
return {
id: "1",
name: "Admin",
email: "admin@admin.com",
}
}

return null
},
}),
],

secret: process.env.NEXTAUTH_SECRET,

pages: {
signIn: "/",
},
})

export { handler as GET, handler as POST }