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
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 right-4 z-50 glass rounded-full px-4 py-2 glow"
    >
      <span className="text-sm font-medium text-white">
        Table {tableNumber}
      </span>
    </motion.div>
  );
}
