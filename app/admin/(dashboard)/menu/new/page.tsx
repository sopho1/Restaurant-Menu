import prisma from "@/lib/prisma"
import { MenuFormClient } from "@/components/MenuFormClient"

export const dynamic = "force-dynamic"

export default async function NewMenuPage() {
  const categories = await prisma.category.findMany()

  return <MenuFormClient categories={categories} />
}
