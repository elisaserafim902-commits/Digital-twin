import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
providers: [
CredentialsProvider({
name: "Credentials",
credentials: {
email: { label: "Email", type: "text" },
password: { label: "Senha", type: "password" }
},
async authorize(credentials) {
return { id: "1", name: "User", email: credentials?.email }
}
})
]
}