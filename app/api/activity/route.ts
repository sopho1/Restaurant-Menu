import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
  try {
    const activityClient = (prisma as any).activity
    if (!activityClient) {
      return NextResponse.json([], { status: 200 })
    }

    const activities = await activityClient.findMany({
      orderBy: { createdAt: "desc" },
      take: 12,
      include: {
        user: { select: { email: true } },
      },
    })

    return NextResponse.json(activities)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch activity" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    const body = await req.json()

    let userId: string | undefined = undefined
    if (session?.user?.email) {
      const foundUser = await prisma.user.findUnique({ where: { email: session.user.email } })
      userId = foundUser?.id ?? undefined
    }

    const activityClient = (prisma as any).activity
    if (!activityClient) {
      return NextResponse.json({ error: "Activity model not available" }, { status: 500 })
    }

    const activity = await activityClient.create({
      data: {
        type: body.type ?? "general",
        message: body.message ?? "Activity recorded",
        metadata: body.metadata ?? null,
        userId,
      },
    })

    return NextResponse.json(activity)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create activity" }, { status: 500 })
  }
}
