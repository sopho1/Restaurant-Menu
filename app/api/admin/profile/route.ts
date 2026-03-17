import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  return NextResponse.json({ id: user.id, email: user.email, createdAt: user.createdAt })
}

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const payload = await req.json()
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const updates: any = {}
  if (payload.email && payload.email !== user.email) updates.email = payload.email
  if (payload.password) updates.password = await hash(payload.password, 10)

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No update fields" }, { status: 400 })
  }

  const updated = await prisma.user.update({ where: { id: user.id }, data: updates })

  const activityClient = (prisma as any).activity
  if (activityClient) {
    await activityClient.create({
      data: {
        type: "profile",
        message: `Updated profile settings for ${updated.email}`,
        userId: updated.id,
      },
    })
  }

  return NextResponse.json({ message: "Profile updated" })
}
