"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function TableBadge() {
  const [tableNumber, setTableNumber] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const table = params.get("table");

    if (table) {
      localStorage.setItem("tableNumber", table);
      setTableNumber(table);
    } else {
      setTableNumber(localStorage.getItem("tableNumber"));
    }
  }, []);

  if (!tableNumber) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="fixed top-8 right-8 z-[100]"
    >
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-accent to-gold-gradient rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
        <div className="relative glass px-6 py-2 rounded-full border border-accent/20 flex items-center gap-3 backdrop-blur-2xl shadow-2xl">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-xs font-bold text-foreground tracking-[0.2em] uppercase">
            Reserved Table {tableNumber}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
