import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { CategorySchema } from "@/lib/schemas"
import { auth } from "@/lib/auth"

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
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
    const validatedData = CategorySchema.parse(body)

    const category = await prisma.category.create({
      data: validatedData,
    })

    const activityClient = (prisma as any).activity
    if (activityClient) {
      await activityClient.create({
        data: {
          type: "category",
          message: `Created category '${category.name}'.`,
          userId,
        },
      })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("Category create error:", error)
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
  }
}
