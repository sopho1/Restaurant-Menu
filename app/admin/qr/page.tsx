"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import QRCode from "qrcode";

export default function QRGeneratorPage() {
  const [url, setUrl] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const baseUrl = window.location.origin;
      setUrl(baseUrl);
    }
  }, []);

  const generateQR = async () => {
    setLoading(true);
    try {
      const fullUrl = tableNumber
        ? `${url}?table=${tableNumber}`
        : url;

      const dataUrl = await QRCode.toDataURL(fullUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      setQrDataUrl(dataUrl);
    } catch (err) {
      console.error("Error generating QR code:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    if (!qrDataUrl) return;

    const link = document.createElement("a");
    link.download = tableNumber
      ? `qr-table-${tableNumber}.png`
      : "qr-menu.png";
    link.href = qrDataUrl;
    link.click();
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-8 md:p-12 glow"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            QR Code Generator
          </h1>
          <p className="text-gray-300 mb-8">
            Generate QR codes for your restaurant menu. Customers can scan to
            view the menu on their phones.
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Menu URL
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                placeholder="https://your-restaurant-menu.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Table Number (Optional)
              </label>
              <input
                type="text"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                placeholder="e.g., 12"
              />
              <p className="text-sm text-gray-400 mt-2">
                If provided, the QR code will include table tracking.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={generateQR}
              disabled={loading || !url}
              className="w-full glass rounded-lg px-6 py-4 text-white font-semibold glow hover:glow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Generating..." : "Generate QR Code"}
            </motion.button>

            {qrDataUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div className="flex justify-center">
                  <div className="glass rounded-2xl p-6 glow">
                    <img
                      src={qrDataUrl}
                      alt="QR Code"
                      className="w-64 h-64"
                    />
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-gray-300 mb-4">
                    {tableNumber
                      ? `QR Code for Table ${tableNumber}`
                      : "QR Code for Main Menu"}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={downloadQR}
                    className="glass rounded-lg px-6 py-3 text-white font-semibold glow hover:glow-lg transition-all"
                  >
                    Download QR Code
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>

          <div className="mt-12 pt-8 border-t border-white/10">
            <h2 className="text-2xl font-bold mb-4">Instructions</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Enter your menu URL (or use the default current URL)</li>
              <li>Optionally add a table number for table tracking</li>
              <li>Click "Generate QR Code"</li>
              <li>Download and print the QR code</li>
              <li>Place QR codes on tables or menus</li>
            </ol>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
