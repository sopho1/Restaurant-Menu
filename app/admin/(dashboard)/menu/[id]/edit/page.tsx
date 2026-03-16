import prisma from "@/lib/prisma"
import { MenuFormClient } from "@/components/MenuFormClient"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function EditMenuPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [categories, menuItem] = await Promise.all([
    prisma.category.findMany(),
    prisma.menuItem.findUnique({ where: { id } }),
  ])

  if (!menuItem) {
    notFound()
  }

  return <MenuFormClient categories={categories} initialData={menuItem} />
}
