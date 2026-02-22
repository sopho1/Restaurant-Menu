"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function TableBadge() {
  const [tableNumber, setTableNumber] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const table = params.get("table");
      if (table) {
        setTableNumber(table);
        localStorage.setItem("tableNumber", table);
      } else {
        const stored = localStorage.getItem("tableNumber");
        if (stored) setTableNumber(stored);
      }
    }
  }, []);

  if (!tableNumber) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-6 right-6 z-50 glass rounded-full px-5 py-2.5 border border-[var(--glass-border)]"
    >
      <span className="text-sm font-medium text-white tracking-wide">
        Table {tableNumber}
      </span>
    </motion.div>
  );
}
