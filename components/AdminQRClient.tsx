"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { QrCode, ArrowRight, Download, ShieldCheck, Zap } from "lucide-react"

type MenuType = "normal" | "special"

export function AdminQRClient() {
  const [menuType, setMenuType] = useState<MenuType>("normal")
  const [tableNumber, setTableNumber] = useState("")
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)

  const [passwordInput, setPasswordInput] = useState("")
  const [authError, setAuthError] = useState("")
  const [passwordAttempts, setPasswordAttempts] = useState(0)

  const BASE_DOMAIN = "https://annagalleria.vercel.app/"

  const CORRECT_PASSWORD = process.env.NEXT_PUBLIC_QR_ADMIN_PASSWORD || "anna123"

  const handleGenerateClick = () => {
    setShowPasswordModal(true)
    setPasswordAttempts(0)
    setPasswordInput("")
    setAuthError("")
  }

  const verifyPasswordAndGenerate = () => {
    if (passwordInput !== CORRECT_PASSWORD) {
      const newAttempts = passwordAttempts + 1
      setPasswordAttempts(newAttempts)

      if (newAttempts >= 3) {
        setAuthError("Maximum attempts exceeded. Access locked.")
        setTimeout(() => {
          setShowPasswordModal(false)
          setPasswordAttempts(0)
          setPasswordInput("")
          setAuthError("")
        }, 2000)
      } else {
        setAuthError(`Incorrect password. ${3 - newAttempts} attempts remaining.`)
      }
      return
    }

    setShowPasswordModal(false)
    setPasswordAttempts(0)
    setPasswordInput("")
    setAuthError("")
    generateQR()
  }

  const generateQR = async () => {
    setLoading(true)

    try {
      let targetUrl = menuType === "normal" ? BASE_DOMAIN : `${BASE_DOMAIN}/special`
      if (tableNumber.trim()) targetUrl += `?table=${encodeURIComponent(tableNumber.trim())}`

      const dataUrl = await import("qrcode").then((QRCode) =>
        QRCode.toDataURL(targetUrl, {
          width: 1024,
          margin: 2,
          color: { dark: "#000000", light: "#FFFFFF" },
        })
      )

      setQrDataUrl(dataUrl as string)
      setShowQRModal(true)

      fetch("/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "qr",
          message: `Generated QR for ${menuType} table ${tableNumber || "general"}`,
          metadata: { menuType, tableNumber, targetUrl },
        }),
      }).catch((err) => console.error("Failed to log QR activity", err))
    } catch (error) {
      console.error("QR generation failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const downloadQR = () => {
    if (!qrDataUrl) return
    const link = document.createElement("a")
    link.download = `qr-${menuType}-${tableNumber || "general"}.png`
    link.href = qrDataUrl
    link.click()
  }

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-8 animate-float">
          <QrCode size={40} />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-luxury text-gold-gradient">Identity Generator</h1>
        <p className="text-muted-foreground font-light tracking-wide max-w-lg mx-auto">Create secure, branded gateways to your digital culinary masterpiece.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-morphism rounded-[2.5rem] p-10 border border-border space-y-10">
          <div className="space-y-6">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/50">Select Experience</h2>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setMenuType("normal")} className={`py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-500 ${menuType === "normal" ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20" : "bg-card text-muted-foreground hover:bg-accent/5 hover:text-foreground border border-border"}`}>
                Signature
              </button>
              <button onClick={() => setMenuType("special")} className={`py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-500 ${menuType === "special" ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20" : "bg-card text-muted-foreground hover:bg-accent/5 hover:text-foreground border border-border"}`}>
                Exclusive
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/50">Table Reference</h3>
            <input value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} placeholder="e.g. Royal Table 01" className="w-full bg-card border border-border rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-accent/40 transition-all text-foreground placeholder:text-muted-foreground/40" />
          </div>

          <button onClick={handleGenerateClick} disabled={loading} className="w-full py-5 bg-foreground text-background dark:bg-white dark:text-black rounded-2xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-accent hover:text-accent-foreground transition-all duration-500 flex items-center justify-center gap-3 shadow-xl">
            {loading ? "Forging Link..." : "Generate Gateway"}
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          <div className="glass-morphism rounded-[2.5rem] p-8 border border-border flex items-start gap-6 group hover:bg-accent/5 transition-all">
            <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-2">Secure Branding</h4>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">Integrated logo placement ensures customers trust the digital link.</p>
            </div>
          </div>

          <div className="glass-morphism rounded-[2.5rem] p-8 border border-border flex items-start gap-6 group hover:bg-accent/5 transition-all">
            <div className="p-4 rounded-2xl bg-accent/10 text-accent group-hover:scale-110 transition-transform">
              <Zap size={24} />
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-2">Instant Updates</h4>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">QR codes point to dynamic lists that reflect your dashboard in real-time.</p>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 dark:bg-black/80 backdrop-blur-2xl">
            <div className="absolute inset-0" onClick={() => setShowPasswordModal(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-md glass-morphism rounded-[3rem] p-12 border border-border">
              <div className="text-center space-y-6 mb-10">
                <div className="w-16 h-16 rounded-2xl bg-card flex items-center justify-center mx-auto text-muted-foreground/20">
                  <ShieldCheck size={32} />
                </div>
                <h2 className="text-2xl font-bold text-luxury text-gold-gradient">Authorization Required</h2>
                <p className="text-sm text-muted-foreground font-light">Enter password to generate QR code</p>
              </div>

              <div className="space-y-6">
                <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && verifyPasswordAndGenerate()} className="w-full bg-card border border-border rounded-2xl py-5 px-6 text-center text-xl tracking-widest focus:outline-none focus:border-accent/40 transition-all text-foreground" placeholder="••••••••" autoFocus />
                {authError && <p className="text-center text-rose-500 text-xs font-bold uppercase tracking-widest">{authError}</p>}
                <button onClick={verifyPasswordAndGenerate} className="w-full py-5 bg-accent text-accent-foreground rounded-2xl font-bold uppercase tracking-widest text-xs hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all">Verify Access</button>
              </div>
            </motion.div>
          </div>
        )}

        {showQRModal && qrDataUrl && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 dark:bg-black/95 backdrop-blur-3xl">
            <div className="absolute inset-0" onClick={() => setShowQRModal(false)} />
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="relative w-full max-w-xl glass-morphism rounded-[3rem] p-12 border border-border text-center">
              <h3 className="text-2xl font-bold text-luxury text-gold-gradient mb-4">Link Established</h3>
              <p className="text-muted-foreground/40 text-[10px] font-bold uppercase tracking-[0.4em] mb-10">{menuType === "normal" ? "Signature Experience" : "Exclusive Experience"} {tableNumber && `• Table ${tableNumber}`}</p>
              <img src={qrDataUrl} alt="QR Code" className="max-w-full mx-auto mb-6 rounded-2xl" />
              <button onClick={() => setShowQRModal(false)} className="absolute top-8 right-8 text-muted-foreground hover:text-foreground">✕</button>
              <button onClick={downloadQR} className="py-4 px-8 bg-accent text-accent-foreground rounded-2xl font-bold uppercase tracking-widest text-xs hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all">Download QR</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
