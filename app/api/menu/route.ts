import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { MenuItemSchema } from "@/lib/schemas"
import { auth } from "@/lib/auth"
import { Prisma } from "@prisma/client"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    const where: Prisma.MenuItemWhereInput = {}
    if (category) where.category = { name: category }
    if (search) where.name = { contains: search, mode: "insensitive" }

    const menuItems = await prisma.menuItem.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(menuItems)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch menu items" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    let userId = session?.user?.id

    if (!userId) {
      const adminEmail = process.env.ADMIN_EMAIL || "admin@restaurant.com"
      const admin = await prisma.user.findUnique({ where: { email: adminEmail } })
      userId = admin?.id
    }

    const body = await req.json()
    const validatedData = MenuItemSchema.parse(body)

    const menuItem = await prisma.menuItem.create({
      data: validatedData,
      include: { category: true },
    })

    const activityClient = (prisma as any).activity
    if (activityClient) {
      await activityClient.create({
        data: {
          type: "menu",
          message: `Created menu item '${menuItem.name}' in category '${menuItem.category.name}'`,
          userId,
        },
      })
    }

    return NextResponse.json(menuItem)
  } catch (error) {
    console.error("Menu creation error:", error)
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
  }
}
