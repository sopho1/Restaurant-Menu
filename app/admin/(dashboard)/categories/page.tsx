import prisma from "@/lib/prisma"
import { CategoriesClient } from "@/components/CategoriesClient"

export const dynamic = "force-dynamic"

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  })

  return <CategoriesClient initialCategories={categories} />
}
