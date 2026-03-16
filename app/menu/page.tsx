import prisma from "@/lib/prisma"
import { MenuClient } from "@/components/MenuClient"

export const dynamic = "force-dynamic"

export default async function MenuPage() {
  const [categories, items] = await Promise.all([
    prisma.category.findMany({
      orderBy: { createdAt: "asc" },
    }),
    prisma.menuItem.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
  ])

  return <MenuClient categories={categories} initialItems={items} />
}
