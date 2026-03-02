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
  const [passwordAttempts, setPasswordAttempts] = useState(0);

  const BASE_DOMAIN = "https://restaurant-menu-rho-mocha.vercel.app/";
  const LOGO_URL = "/favicon.ico";

  const handleGenerateClick = () => {
    setShowPasswordModal(true);
    setPasswordAttempts(0);
    setPasswordInput("");
    setAuthError("");
  };

  const verifyPasswordAndGenerate = async () => {
    const correctPassword = process.env.NEXT_PUBLIC_QR_ADMIN_PASSWORD;

    if (passwordInput !== correctPassword) {
      const newAttempts = passwordAttempts + 1;
      setPasswordAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        setAuthError("Maximum attempts exceeded. Modal closing...");
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordAttempts(0);
          setPasswordInput("");
          setAuthError("");
        }, 1500);
      } else {
        setAuthError(`Incorrect password. ${3 - newAttempts} attempts remaining.`);
      }
      return;
    }

    setShowPasswordModal(false);
    setAuthError("");
    setPasswordInput("");
    setPasswordAttempts(0);
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

  const handleModalClose = () => {
    setShowPasswordModal(false);
    setPasswordAttempts(0);
    setPasswordInput("");
    setAuthError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl text-center space-y-12">
        {/* HEADER */}
        <div className="space-y-4 text-white">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            QR Menu Generator
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg md:text-xl">
            Generate secure branded QR codes for your restaurant.
          </p>
        </div>

        {/* MAIN CARD */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 md:p-16 shadow-2xl border border-white/20 text-white">
          <div className="space-y-12">
            {/* MENU TYPE SECTION */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white/90 text-center">
                Select Menu Type
              </h2>

              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <button
                  onClick={() => setMenuType("normal")}
                  className={`px-10 py-6 rounded-xl font-semibold transition-all duration-300 cursor-pointer text-lg ${
                    menuType === "normal"
                      ? "bg-white text-purple-700 shadow-2xl scale-105"
                      : "bg-white/20 hover:bg-white/30 hover:scale-105"
                  }`}
                >
                  Normal Menu
                </button>

                <button
                  onClick={() => setMenuType("special")}
                  className={`px-10 py-6 rounded-xl font-semibold transition-all duration-300 cursor-pointer text-lg ${
                    menuType === "special"
                      ? "bg-white text-purple-700 shadow-2xl scale-105"
                      : "bg-white/20 hover:bg-white/30 hover:scale-105"
                  }`}
                >
                  Special Menu
                </button>
              </div>
            </div>

            {/* TABLE INPUT SECTION - Clearly separated */}
            <div className="space-y-4 max-w-md mx-auto w-full">
              <label className="block text-lg text-white/80 font-medium">
                Optional Table Number
              </label>

              <input
                type="text"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="e.g. Table 12"
                className="w-full px-8 py-6 rounded-2xl bg-white/20 border-2 border-white/30 focus:outline-none focus:ring-4 focus:ring-white/40 text-center text-xl placeholder-white/50 text-white"
              />
              <p className="text-sm text-white/60 text-left">
                Leave empty for general menu
              </p>
            </div>

            {/* GENERATE BUTTON */}
            <div className="pt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerateClick}
                disabled={loading}
                className="bg-white text-purple-700 font-bold px-16 py-6 rounded-2xl cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 text-xl w-full sm:w-auto"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating...
                  </span>
                ) : (
                  "Generate QR Code"
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* PASSWORD MODAL */}
      <AnimatePresence>
        {showPasswordModal && (
          <Modal onClose={handleModalClose}>
            <div className="space-y-10">
              <div className="text-center space-y-3">
                <h2 className="text-3xl font-bold text-purple-700">
                  Admin Access
                </h2>
                <p className="text-gray-500">
                  Enter password to generate QR code
                </p>
              </div>

              <div className="space-y-8">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && passwordAttempts < 3) {
                      verifyPasswordAndGenerate();
                    }
                  }}
                  className="w-full px-6 py-5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-600 text-center text-xl text-gray-800 placeholder-gray-400"
                  placeholder="Enter admin password"
                  disabled={passwordAttempts >= 3}
                />

                {authError && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-center font-medium ${
                      passwordAttempts >= 3 ? 'text-orange-500' : 'text-red-500'
                    }`}
                  >
                    {authError}
                  </motion.p>
                )}

                <button
                  onClick={verifyPasswordAndGenerate}
                  disabled={passwordAttempts >= 3}
                  className="w-full bg-purple-600 text-white px-8 py-5 rounded-xl font-bold text-lg cursor-pointer hover:bg-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {passwordAttempts >= 3 ? "Modal Closing..." : "Verify & Generate"}
                </button>

                <p className="text-xs text-gray-400 text-center pt-4">
                  {passwordAttempts < 3 ? 
                    `${3 - passwordAttempts} attempt(s) remaining` : 
                    "Maximum attempts reached"}
                </p>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* QR MODAL */}
      <AnimatePresence>
        {showQRModal && qrDataUrl && (
          <Modal onClose={() => setShowQRModal(false)}>
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-purple-700">
                  {menuType === "normal" ? "Normal Menu" : "Special Menu"} QR Code
                </h3>
                {tableNumber.trim() && (
                  <p className="text-gray-500 text-lg">
                    Table {tableNumber.trim()}
                  </p>
                )}
              </div>

              <div className="relative inline-block w-full">
                <img
                  src={qrDataUrl}
                  alt="QR Code"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />

                {/* LOGO */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white p-4 rounded-xl shadow-2xl">
                    <img
                      src={LOGO_URL}
                      alt="Logo"
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={downloadQR}
                className="w-full bg-purple-600 text-white px-8 py-5 rounded-xl font-bold text-lg hover:bg-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
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
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}