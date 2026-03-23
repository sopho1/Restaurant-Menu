"use client"

import { useEffect, useState } from "react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

type ActivityChartProps = {
  initialData: Array<{ day: string; count: number }>
}

function buildSevenDaySeries(activities: Array<{ createdAt: string | Date }>) {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const days = Array.from({ length: 7 }, (_, idx) => {
    const date = new Date(now)
    date.setDate(now.getDate() - (6 - idx))
    const short = date.toLocaleDateString(undefined, { weekday: "short" })
    const iso = date.toISOString().slice(0, 10)
    const count = activities.filter((item) => {
      const itemDate = new Date(item.createdAt)
      return itemDate.toISOString().slice(0, 10) === iso
    }).length

    return { day: short, count }
  })

  return days
}

export function ActivityChart({ initialData }: ActivityChartProps) {
  const [chartData, setChartData] = useState(initialData)

  useEffect(() => {
    setChartData(initialData)
  }, [initialData])

  useEffect(() => {
    let mounted = true

    async function fetchActivity() {
      try {
        const response = await fetch("/api/activity")
        if (!response.ok) return

        const activities = await response.json()
        if (!mounted || !Array.isArray(activities)) return

        const liveData = buildSevenDaySeries(activities)
        setChartData(liveData)
      } catch (error) {
        console.error("Failed to fetch activity for chart", error)
      }
    }

    fetchActivity()
    const intervalId = setInterval(fetchActivity, 5000)

    return () => {
      mounted = false
      clearInterval(intervalId)
    }
  }, [])

  const hasData = chartData.some((item) => item.count > 0)
  const displayData = chartData.length ? chartData : buildSevenDaySeries([])

  return (
    <div className="w-full h-56">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={displayData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff22" />
          <XAxis dataKey="day" stroke="#cbd5e1" tick={{ fontSize: 10, fill: "#a1a1aa" }} />
          <YAxis stroke="#cbd5e1" tick={{ fontSize: 10, fill: "#a1a1aa" }} allowDecimals={false} />
          <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155" }} itemStyle={{ color: "#f8fafc" }} />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#f97316"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            isAnimationActive={false}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
      {!hasData && (
        <p className="text-xs text-center text-muted-foreground mt-2">
          No activity yet. Add items or categories to populate the chart in real-time.
        </p>
      )}
    </div>
  )
}
