import prisma from "@/lib/prisma"
import { MenuClient } from "@/components/MenuClient"

export const dynamic = "force-dynamic"

export default async function CategoryPage({
  params,
}: {
  params: { category: string }
}) {
  const decodedCategory = decodeURIComponent(params.category)
  
  const [categories, items] = await Promise.all([
    prisma.category.findMany({
      orderBy: { createdAt: "asc" },
    }),
    prisma.menuItem.findMany({
      where: {
        category: {
          name: {
            equals: decodedCategory,
            mode: "insensitive"
          }
        }
      },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
  ])

  return <MenuClient categories={categories} initialItems={items} />
}
