"use client"

import { useEffect, useState } from "react"
import toast from "react-hot-toast"

type Profile = {
  id: string
  email: string
  createdAt: string
}

export function AdminSettingsClient() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/api/admin/profile")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setProfile(data)
          setEmail(data.email)
        }
      })
      .catch(() => {
        toast.error("Unable to load admin profile")
      })
  }, [])

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: password || undefined }),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || "Failed to update")
      }

      setPassword("")
      toast.success("Settings updated")

    } catch (error) {
      toast.error(`Update failed: ${error}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gold-gradient">Admin Settings</h1>
        <p className="text-foreground-muted mt-2">Adjust control panel credentials and profile settings.</p>
      </div>

      {profile ? (
        <form onSubmit={onSave} className="space-y-6 max-w-xl">
          <div>
            <label className="block mb-2 text-sm font-medium text-white">Email</label>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white"
              type="email"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-white">New password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white"
              type="password"
              placeholder="Leave blank to keep current password"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-accent px-6 py-3 font-bold text-black hover:bg-accent/90 transition-all disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </form>
      ) : (
        <div className="rounded-2xl bg-white/5 p-6">Loading profile...</div>
      )}
    </div>
  )
}
