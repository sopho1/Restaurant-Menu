import prisma from "@/lib/prisma"
import { Users, Utensils, Tags, TrendingUp, ArrowUpRight, Activity } from "lucide-react"

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
          <div className="space-y-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold">
                  JS
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">New item added to "Main Course"</p>
                  <p className="text-xs text-foreground-muted">2 hours ago</p>
                </div>
                <div className="text-accent">
                  <Activity size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-morphism rounded-3xl p-10 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-6 animate-float">
            <TrendingUp size={32} />
          </div>
          <h3 className="text-xl font-bold text-luxury mb-2">Performance Spike</h3>
          <p className="text-foreground-muted font-light max-w-xs mx-auto">Your menu views are up 24% this week. Consider highlighting your best-sellers.</p>
          <button className="mt-8 px-8 py-3 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all">Details</button>
        </div>
      </div>
    </div>
  )
}

