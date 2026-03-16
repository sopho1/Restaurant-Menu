import prisma from "@/lib/prisma"
import { AdminMenuClient } from "@/components/AdminMenuClient"

export const dynamic = "force-dynamic"

export default async function AdminMenuPage() {
  const items = await prisma.menuItem.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  })

  return <AdminMenuClient initialItems={items} />
}
