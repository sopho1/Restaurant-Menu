"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QRCode from "qrcode";

type MenuType = "normal" | "special";

export default function QRGeneratorPage() {
  const [menuType, setMenuType] = useState<MenuType>("normal");
  const [tableNumber, setTableNumber] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  const BASE_DOMAIN = "https://yourdomain.com"; // 🔒 replace
  const LOGO_URL = "/favicon.ico"; // 🔥 place logo inside /public

  const handleGenerateClick = () => {
    setShowPasswordModal(true);
  };

  const verifyPasswordAndGenerate = async () => {
    const correctPassword = process.env.NEXT_PUBLIC_QR_ADMIN_PASSWORD;

    if (passwordInput !== correctPassword) {
      setAuthError("Incorrect password");
      return;
    }

    setShowPasswordModal(false);
    setAuthError("");
    setPasswordInput("");

    await generateQR();
  };

  const generateQR = async () => {
    setLoading(true);

    try {
      let targetUrl =
        menuType === "normal"
          ? BASE_DOMAIN
          : `${BASE_DOMAIN}/special`;

      if (tableNumber.trim()) {
        targetUrl += `?table=${tableNumber.trim()}`;
      }

      const dataUrl = await QRCode.toDataURL(targetUrl, {
        width: 600,
        margin: 2,
        color: {
          dark: "#111827",
          light: "#FFFFFF",
        },
      });

      setQrDataUrl(dataUrl);
    } catch (err) {
      console.error("QR generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    if (!qrDataUrl) return;

    const link = document.createElement("a");
    link.download =
      menuType === "normal"
        ? "qr-normal-menu.png"
        : "qr-special-menu.png";

    link.href = qrDataUrl;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center p-6">

      <div className="w-full max-w-4xl text-center">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-white"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            QR Menu Generator
          </h1>
          <p className="text-white/80 max-w-xl mx-auto">
            Generate a secure branded QR code for your restaurant.
          </p>
        </motion.div>

        {/* MAIN CARD */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/20 text-white">

          {/* MENU TYPE */}
          <div className="flex justify-center gap-6 mb-10">
            <button
              onClick={() => setMenuType("normal")}
              className={`px-8 py-4 rounded-xl font-semibold transition ${
                menuType === "normal"
                  ? "bg-white text-purple-700 shadow-lg"
                  : "bg-white/20 hover:bg-white/30"
              }`}
            >
              Normal Menu
            </button>

            <button
              onClick={() => setMenuType("special")}
              className={`px-8 py-4 rounded-xl font-semibold transition ${
                menuType === "special"
                  ? "bg-white text-purple-700 shadow-lg"
                  : "bg-white/20 hover:bg-white/30"
              }`}
            >
              Special Menu
            </button>
          </div>

          {/* TABLE NUMBER */}
          <div className="max-w-md mx-auto mb-8">
            <input
              type="text"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="Optional Table Number (e.g. 12)"
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/60 text-center"
            />
          </div>

          {/* GENERATE BUTTON */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGenerateClick}
            disabled={loading}
            className="bg-white text-purple-700 font-semibold px-10 py-4 rounded-xl shadow-lg hover:shadow-2xl transition disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate QR Code"}
          </motion.button>

          {/* QR PREVIEW */}
          {qrDataUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-12 space-y-6"
            >
              <div className="relative inline-block">
                <img
                  src={qrDataUrl}
                  alt="QR Code"
                  className="w-80 h-80 rounded-2xl"
                />

                {/* LOGO EMBEDDED */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white p-3 rounded-xl shadow-lg">
                    <img
                      src={LOGO_URL}
                      alt="Logo"
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                </div>
              </div>

              <div>
                <p className="text-white font-medium">
                  {menuType === "normal"
                    ? "Normal Menu"
                    : "Special Menu"}
                </p>

                {tableNumber.trim() && (
                  <p className="text-white/80 mt-1">
                    Table {tableNumber.trim()}
                  </p>
                )}
              </div>

              <button
                onClick={downloadQR}
                className="bg-purple-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:bg-purple-900 transition"
              >
                Download QR Code
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* PASSWORD MODAL */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-8 w-96 text-center shadow-2xl"
            >
              <h2 className="text-xl font-semibold mb-4">
                Admin Password Required
              </h2>

              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Enter password"
              />

              {authError && (
                <p className="text-red-500 text-sm mb-3">
                  {authError}
                </p>
              )}

              <button
                onClick={verifyPasswordAndGenerate}
                className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold w-full hover:bg-purple-700 transition"
              >
                Verify & Generate
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}