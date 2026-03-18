import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminDashboardLayoutClient } from "@/components/AdminDashboardLayoutClient"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect("/admin/login")
  }

  const adminEmail = process.env.ADMIN_EMAIL || "admin@restaurant.com"
  const userEmail = session?.user?.email ?? adminEmail

  return (
    <AdminDashboardLayoutClient userEmail={userEmail}>
      {children}
    </AdminDashboardLayoutClient>
  )
}
