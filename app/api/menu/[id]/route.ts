import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { MenuItemSchema } from "@/lib/schemas"
import { auth } from "@/lib/auth"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: params.id },
      include: { category: true },
    })

    if (!menuItem) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 })
    }

    return NextResponse.json(menuItem)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch menu item" }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const validatedData = MenuItemSchema.parse(body)

    const menuItem = await prisma.menuItem.update({
      where: { id: params.id },
      data: validatedData,
      include: { category: true },
    })

    return NextResponse.json(menuItem)
  } catch (error) {
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const menuItem = await prisma.menuItem.delete({
      where: { id: params.id },
    })

    return NextResponse.json(menuItem)
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete menu item" }, { status: 500 })
  }
}
