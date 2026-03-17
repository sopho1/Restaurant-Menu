import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import prisma from "./prisma"

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          })

          if (!user) return null

          const passwordsMatch = await compare(
            credentials.password as string,
            user.password
          )

          if (passwordsMatch) return { id: user.id, email: user.email }
        } catch (error) {
          console.error("Auth error:", error)
        }

        return null
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60, // 1 minute session lifetime
    updateAge: 30, // refresh token every 30 seconds while active
  },
  jwt: {
    maxAge: 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        ;(session.user as any).id = token.id
      }
      return session
    },
  },
  pages: {
    signIn: "/admin/login",
  },
})
