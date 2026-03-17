import prisma from "@/lib/prisma"
import { Users, Utensils, Tags, TrendingUp, ArrowUpRight, Activity } from "lucide-react"
import { ActivityChart } from "@/components/ActivityChart"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const [totalItems, totalCategories, hotItems, availableItems] = await Promise.all([
    prisma.menuItem.count(),
    prisma.category.count(),
    prisma.menuItem.count({ where: { isHot: true } }),
    prisma.menuItem.count({ where: { isAvailable: true } }),
  ])

  const stats = [
    {
      label: "Total Menu Items",
      value: totalItems,
      icon: Utensils,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      trend: "+12% this month"
    },
    {
      label: "Categories",
      value: totalCategories,
      icon: Tags,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      trend: "Steady"
    },
    {
      label: "Hot Items",
      value: hotItems,
      icon: TrendingUp,
      color: "text-rose-400",
      bg: "bg-rose-400/10",
      trend: "+5 active"
    },
    {
      label: "Available Now",
      value: availableItems,
      icon: Activity,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      trend: "94% stock"
    },
  ]

  const activityClient = (prisma as any).activity
  const recentActivities = (activityClient
    ? await activityClient.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { user: { select: { email: true } } },
      })
    : []) as Array<{ id: string; type: string; message: string; createdAt: Date; user?: { email?: string } }>


  const weekStart = new Date()
  weekStart.setHours(0, 0, 0, 0)
  weekStart.setDate(weekStart.getDate() - 6)

  const weekActivities = (activityClient
    ? await activityClient.findMany({
        where: { createdAt: { gte: weekStart } },
        orderBy: { createdAt: "asc" },
      })
    : []) as Array<{ createdAt: Date }>

  const dailyCounts = Array.from({ length: 7 }, (_, idx) => {
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + idx)
    const iso = date.toISOString().slice(0, 10)
    return {
      date,
      label: iso,
      short: date.toLocaleDateString(undefined, { weekday: "short" }),
      count: weekActivities.filter((a) => a.createdAt.toISOString().slice(0, 10) === iso).length,
    }
  })

  const maxDaily = Math.max(1, ...dailyCounts.map((d) => d.count))

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-luxury text-gold-gradient mb-2">Metrics Overview</h1>
        <p className="text-foreground-muted font-light tracking-wide">Real-time performance of your culinary gallery.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="glass-morphism rounded-3xl p-8 group hover:bg-white/5 transition-all duration-500">
            <div className="flex items-start justify-between mb-8">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-transform duration-500 group-hover:scale-110`}>
                <stat.icon size={24} />
              </div>
              <div className="text-emerald-400 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
                <ArrowUpRight size={12} />
                {stat.trend}
              </div>
            </div>
            
            <p className="text-foreground-muted text-sm font-medium tracking-wide mb-2">{stat.label}</p>
            <h2 className="text-4xl font-bold tracking-tight text-white">{stat.value}</h2>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-morphism rounded-3xl p-10">
          <h3 className="text-xl font-bold text-luxury mb-8">Recent Activity</h3>
          <div className="space-y-4 mb-8">
            {recentActivities.length === 0 ? (
              <p className="text-sm text-foreground-muted">No activity yet. Start creating and editing items to generate events.</p>
            ) : (
              recentActivities.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors border border-white/5">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                    {item.type.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{item.message}</p>
                    <p className="text-xs text-foreground-muted">
                      {item.user?.email ?? "Unknown"} • {item.createdAt.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-accent">
                    <Activity size={16} />
                  </div>
                </div>
              ))
            )}
          </div>
          <a href="/admin/activities" className="text-lg font-semibold text-accent hover:text-yellow-300">Show all</a>
        </div>

        <div className="glass-morphism rounded-3xl p-10">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-luxury mb-2">Performance Spike</h3>
              <p className="text-foreground-muted font-light max-w-xs mb-4">
                Recent activity trend for the last 7 days.
              </p>
            </div>
          </div>

          <div className="w-full h-66 mt-4">
            <ActivityChart initialData={dailyCounts.map((d) => ({ day: d.short, count: d.count }))} />
          </div>

          <div className="mt-16 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-sm text-foreground-muted">Total activity last 7d</div>
            <div className="text-2xl font-bold text-white">{weekActivities.length}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

