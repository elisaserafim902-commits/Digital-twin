import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",

      credentials: {
        email: {},
        password: {}
      },

      async authorize(credentials) {

        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where:{
            email: credentials.email
          }
        })

        if(!user){
          return null
        }


        const passwordOk = await bcrypt.compare(
          credentials.password,
          user.password
        )


        if(!passwordOk){
          return null
        }


        return {
          id:user.id,
          email:user.email
        }

      }
    })
  ],


  session:{
    strategy:"jwt"
  },


  pages:{
    signIn:"/login"
  },


  secret:process.env.NEXTAUTH_SECRET
}