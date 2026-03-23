import NextAuth from "next-auth"

const { auth } = NextAuth({
  providers: [],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdmin = nextUrl.pathname.startsWith("/admin")
      const isLoginRoute = nextUrl.pathname.startsWith("/admin/login")

      if (isOnAdmin && !isLoginRoute) {
        if (isLoggedIn) return true
        return false
      }

      if (isLoggedIn && isLoginRoute) {
        return Response.redirect(new URL("/admin/dashboard", nextUrl))
      }

      return true
    },
  },
})

export const middleware = auth

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
