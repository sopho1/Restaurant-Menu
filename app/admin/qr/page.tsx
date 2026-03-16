"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import QRCode from "qrcode";
import { QrCode, ArrowRight, Download, ShieldCheck, Zap } from "lucide-react";

type MenuType = "normal" | "special";

export default function QRGeneratorPage() {
  const [menuType, setMenuType] = useState<MenuType>("normal");
  const [tableNumber, setTableNumber] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [passwordAttempts, setPasswordAttempts] = useState(0);

  const BASE_DOMAIN = "https://restaurant-menu-rho-mocha.vercel.app/";
  const LOGO_URL = "https://images.unsplash.com/photo-1550966842-2849a22fdf07?q=80&w=2071&auto=format&fit=crop";

  const handleGenerateClick = () => {
    setShowPasswordModal(true);
    setPasswordAttempts(0);
    setPasswordInput("");
    setAuthError("");
  };

  const verifyPasswordAndGenerate = async () => {
    const correctPassword = process.env.NEXT_PUBLIC_QR_ADMIN_PASSWORD || "admin123";

    if (passwordInput !== correctPassword) {
      const newAttempts = passwordAttempts + 1;
      setPasswordAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        setAuthError("Maximum attempts exceeded.");
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordAttempts(0);
          setPasswordInput("");
          setAuthError("");
        }, 1500);
      } else {
        setAuthError(`Incorrect credentials. ${3 - newAttempts} attempts remaining.`);
      }
      return;
    }

    setShowPasswordModal(false);
    await generateQR();
  };

  const generateQR = async () => {
    setLoading(true);
    try {
      let targetUrl = menuType === "normal" ? BASE_DOMAIN : `${BASE_DOMAIN}/special`;
      if (tableNumber.trim()) {
        targetUrl += `?table=${tableNumber.trim()}`;
      }

      const dataUrl = await QRCode.toDataURL(targetUrl, {
        width: 1024,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      setQrDataUrl(dataUrl);
      setShowQRModal(true);
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.download = `qr-${menuType}-${tableNumber || "general"}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-8 animate-float">
          <QrCode size={40} />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-luxury text-gold-gradient">
          Identity Generator
        </h1>
        <p className="text-foreground-muted font-light tracking-wide max-w-lg mx-auto">
          Create secure, branded gateways to your digital culinary masterpiece.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Configuration Card */}
        <div className="glass-morphism rounded-[2.5rem] p-10 border border-white/5 space-y-10">
          <div className="space-y-6">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">Select Experience</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setMenuType("normal")}
                className={`py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-500 ${
                  menuType === "normal"
                    ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20"
                    : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white border border-white/5"
                }`}
              >
                Signature
              </button>
              <button
                onClick={() => setMenuType("special")}
                className={`py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-500 ${
                  menuType === "special"
                    ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20"
                    : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white border border-white/5"
                }`}
              >
                Exclusive
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">Table Reference</h3>
            <input
              type="text"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="e.g. Royal Table 01"
              className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-accent/40 transition-all text-white placeholder:text-white/10"
            />
          </div>

          <button
            onClick={handleGenerateClick}
            disabled={loading}
            className="w-full py-5 bg-white text-black rounded-2xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-accent hover:text-accent-foreground transition-all duration-500 flex items-center justify-center gap-3 shadow-xl"
          >
            {loading ? "Forging Link..." : "Generate Gateway"}
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Benefits/Info Card */}
        <div className="flex flex-col gap-6">
          <div className="glass-morphism rounded-[2.5rem] p-8 border border-white/5 flex items-start gap-6 group hover:bg-white/10 transition-all">
             <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
                <ShieldCheck size={24} />
             </div>
             <div>
                <h4 className="font-bold text-white mb-2">Secure Branding</h4>
                <p className="text-sm text-foreground-muted font-light leading-relaxed">Integrated logo placement ensures customers trust the digital link.</p>
             </div>
          </div>
          
          <div className="glass-morphism rounded-[2.5rem] p-8 border border-white/5 flex items-start gap-6 group hover:bg-white/10 transition-all">
             <div className="p-4 rounded-2xl bg-accent/10 text-accent group-hover:scale-110 transition-transform">
                <Zap size={24} />
             </div>
             <div>
                <h4 className="font-bold text-white mb-2">Instant Updates</h4>
                <p className="text-sm text-foreground-muted font-light leading-relaxed">QR codes point to dynamic lists that reflect your dashboard in real-time.</p>
             </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPasswordModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md glass-morphism rounded-[3rem] p-12 border border-white/10"
            >
              <div className="text-center space-y-6 mb-10">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto text-white/20">
                  <ShieldCheck size={32} />
                </div>
                <h2 className="text-2xl font-bold text-luxury text-gold-gradient">Authorization</h2>
                <p className="text-sm text-foreground-muted font-light">Confirm administrative ownership to forge this link.</p>
              </div>

              <div className="space-y-6">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && verifyPasswordAndGenerate()}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 px-6 text-center text-xl tracking-widest focus:outline-none focus:border-accent/40 transition-all text-white"
                  placeholder="••••••••"
                  autoFocus
                />
                {authError && <p className="text-center text-rose-500 text-xs font-bold uppercase tracking-widest">{authError}</p>}
                <button
                  onClick={verifyPasswordAndGenerate}
                  className="w-full py-5 bg-accent text-accent-foreground rounded-2xl font-bold uppercase tracking-widest text-xs hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all"
                >
                  Verify Access
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showQRModal && qrDataUrl && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQRModal(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full max-w-xl glass-morphism rounded-[3rem] p-12 border border-white/10 text-center"
            >
              <h3 className="text-2xl font-bold text-luxury text-gold-gradient mb-4">Link Established</h3>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.4em] mb-10">
                {menuType === "normal" ? "Signature Experience" : "Exclusive Experience"} {tableNumber && `• Table ${tableNumber}`}
              </p>

              <div className="relative inline-block w-full max-w-[320px] mx-auto mb-12 p-8 bg-white rounded-[2rem] shadow-[0_0_100px_rgba(255,255,255,0.1)]">
                <img src={qrDataUrl} alt="QR Link" className="w-full h-auto" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                   <div className="w-16 h-16 bg-white p-3 rounded-2xl shadow-2xl border-4 border-white">
                      <img src={LOGO_URL} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                   </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={downloadQR}
                  className="flex-1 py-5 bg-white text-black rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-accent hover:text-accent-foreground transition-all flex items-center justify-center gap-2"
                >
                  <Download size={16} /> Export Artwork
                </button>
                <button
                  onClick={() => setShowQRModal(false)}
                  className="px-8 py-5 glass border border-white/10 text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-all"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}