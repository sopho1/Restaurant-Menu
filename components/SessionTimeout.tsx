"use client"

import { useEffect, useCallback } from "react"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function SessionTimeout() {
  const { data: session } = useSession()
  const router = useRouter()

  const handleLogout = useCallback(async () => {
    await signOut({ redirect: false })
    router.push("/admin/login")
  }, [router])

  useEffect(() => {
    if (!session) return

    let timeoutId: NodeJS.Timeout

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId)
      // 1 minute = 60000 ms
      timeoutId = setTimeout(handleLogout, 60000)
    }

    // Events to watch for activity
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ]

    const handleActivity = () => {
      resetTimer()
    }

    // Initialize timer
    resetTimer()

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, handleActivity)
    })

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity)
      })
    }
  }, [session, handleLogout])

  return null
}
