import prisma from "@/lib/prisma"
import { Activity } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function ActivitiesPage() {
  const activities = await prisma.activity.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { email: true } } },
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-luxury text-gold-gradient mb-2">Full Activity Log</h1>
        <p className="text-foreground-muted font-light tracking-wide">Review all admin actions, sorted by newest first.</p>
      </div>

      <div className="glass-morphism p-6 rounded-3xl border border-white/10">
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-foreground-muted">No activities yet.</p>
          ) : (
            activities.map((item) => (
              <div key={item.id} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <Activity size={16} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white">{item.message}</p>
                  <p className="text-xs text-foreground-muted">
                    {item.user?.email ?? "Unknown user"} • {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
