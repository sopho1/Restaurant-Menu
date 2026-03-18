import { NextResponse } from "next/server"
import { hash, compare } from "bcryptjs"
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

  type ProfileUpdate = {
    email?: string
    password?: string
  }

  const updates: ProfileUpdate = {}

  if (payload.password) {
    if (!payload.currentPassword) {
      return NextResponse.json({ error: "Current password is required to change password" }, { status: 400 })
    }

    const passwordsMatch = await compare(payload.currentPassword, user.password)
    if (!passwordsMatch) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 })
    }

    updates.password = await hash(payload.password, 10)
  }

  if (payload.email && payload.email !== user.email) {
    updates.email = payload.email
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No update fields" }, { status: 400 })
  }

  const updated = await prisma.user.update({ where: { id: user.id }, data: updates })

  if (prisma.activity) {
    await prisma.activity.create({
      data: {
        type: "profile",
        message: `Updated profile settings for ${updated.email}`,
        userId: updated.id,
      },
    })
  }

  return NextResponse.json({ message: "Profile updated" })
}
