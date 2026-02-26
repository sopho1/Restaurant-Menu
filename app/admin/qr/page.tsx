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
  const [showQRModal, setShowQRModal] = useState(false);

  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  const BASE_DOMAIN = "https://restaurant-menu-rho-mocha.vercel.app/";
  const LOGO_URL = "/favicon.ico";

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
        width: 700,
        margin: 2,
        color: {
          dark: "#111827",
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
    link.download =
      menuType === "normal"
        ? "qr-normal-menu.png"
        : "qr-special-menu.png";

    link.href = qrDataUrl;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center px-6 py-20">

      <div className="w-full max-w-4xl text-center space-y-20">

        {/* HEADER */}
        <div className="space-y-8 text-white">
          <h1 className="text-5xl font-bold">
            QR Menu Generator
          </h1>
          <p className="text-white/80 max-w-xl mx-auto text-lg">
            Generate secure branded QR codes for your restaurant.
          </p>
        </div>

        {/* MAIN CARD */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-16 shadow-2xl border border-white/20 text-white space-y-16">

          {/* MENU TYPE */}
          <div className="space-y-10">
            <h2 className="text-xl font-semibold text-white/80">
              Select Menu Type
            </h2>

            <div className="flex justify-center gap-12">
              <button
                onClick={() => setMenuType("normal")}
                className={`px-12 py-5 rounded font-semibold transition cursor-pointer ${
                  menuType === "normal"
                    ? "bg-white text-purple-700 shadow-xl"
                    : "bg-white/20 hover:bg-white/30"
                }`}
              >
                Normal Menu
              </button>

              <button
                onClick={() => setMenuType("special")}
                className={`px-22 py-5 rounded font-semibold transition cursor-pointer ${
                  menuType === "special"
                    ? "bg-white text-purple-700 shadow-xl"
                    : "bg-white/20 hover:bg-white/30"
                }`}
              >
                Special Menu
              </button>
            </div>
          </div>

          {/* TABLE INPUT — clearly separated */}
          <div className="space-y-6 max-w-md mx-auto">
            <label className="block text-base text-white/70">
              Optional Table Number
            </label>

            <input
              type="text"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="e.g. 12"
              className="w-full px-6 py-5 rounded-2xl bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/60 text-center text-lg"
            />
          </div>

          {/* GENERATE BUTTON */}
          <div className="pt-16">
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGenerateClick}
              disabled={loading}
              className="bg-white text-purple-700 font-semibold px-16 py-5 rounded cursor-pointer shadow-xl hover:shadow-2xl transition disabled:opacity-50 text-lg"
            >
              {loading ? "Generating..." : "Generate QR Code"}
            </motion.button>
          </div>
        </div>
      </div>

      {/* PASSWORD MODAL */}
      <AnimatePresence>
        {showPasswordModal && (
          <Modal>
            <div className="space-y-6 gap-8 flex flex-col items-center justify-center">
              <h2 className="text-purple-700 text-center text-xl font-semibold">
                Admin Password Required
              </h2>

              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-8 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 text-center text-lg text-gray-800"
                placeholder="Enter password"
              />

              {authError && (
                <p className="text-red-500 text-sm">
                  {authError}
                </p>
              )}

              <button
                onClick={verifyPasswordAndGenerate}
                className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold w-[50%] mx-auto cursor-pointer hover:bg-purple-700 transition"
              >
                Verify & Generate
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* QR MODAL */}
      <AnimatePresence>
        {showQRModal && qrDataUrl && (
          <Modal onClose={() => setShowQRModal(false)}>
            <div className="text-center space-y-8">

              <div className="relative inline-block">
                <img
                  src={qrDataUrl}
                  alt="QR Code"
                  className="w-96 h-96 rounded-2xl"
                />

                {/* LOGO */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white p-4 rounded-xl shadow-lg">
                    <img
                      src={LOGO_URL}
                      alt="Logo"
                      className="w-20 h-20 object-contain"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-lg font-semibold text-gray-800">
                  {menuType === "normal"
                    ? "Normal Menu"
                    : "Special Menu"}
                </p>

                {tableNumber.trim() && (
                  <p className="text-gray-500">
                    Table {tableNumber.trim()}
                  </p>
                )}
              </div>

              <button
                onClick={downloadQR}
                className="bg-purple-600 text-white px-10 py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
              >
                Download QR Code
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Reusable Modal Component */
function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-12 shadow-2xl max-w-lg w-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}