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
  const [confirmPassword, setConfirmPassword] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [saving, setSaving] = useState(false)
  const [showCurrentPasswordModal, setShowCurrentPasswordModal] = useState(false)

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

  const saveProfile = async (currentPasswordToSend?: string) => {
    setSaving(true)

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: password || undefined,
          currentPassword: currentPasswordToSend || undefined,
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || "Failed to update")
      }

      setPassword("")
      setConfirmPassword("")
      setCurrentPassword("")
      setShowCurrentPasswordModal(false)
      toast.success("Settings updated")
    } catch (error) {
      toast.error(`Update failed: ${error}`)
    } finally {
      setSaving(false)
    }
  }

  const onSave = (e: React.FormEvent) => {
    e.preventDefault()

    if (password && password !== confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    if (password) {
      setShowCurrentPasswordModal(true)
      return
    }

    saveProfile()
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

          <div>
            <label className="block mb-2 text-sm font-medium text-white">Confirm new password</label>
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white"
              type="password"
              placeholder="Confirm new password"
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

      {showCurrentPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowCurrentPasswordModal(false)} />
          <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0b0b0d] p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-gold-gradient">Confirm Current Password</h2>
            <p className="mt-2 text-sm text-foreground-muted">Enter your existing password to authorize the profile update.</p>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-4 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white"
              placeholder="Current password"
              autoFocus
            />
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowCurrentPasswordModal(false)}
                className="flex-1 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!currentPassword) {
                    toast.error("Current password is required")
                    return
                  }
                  saveProfile(currentPassword)
                }}
                className="flex-1 rounded-xl bg-accent px-4 py-3 font-bold text-black hover:bg-accent/90"
                disabled={saving}
              >
                {saving ? "Saving..." : "Confirm and Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
