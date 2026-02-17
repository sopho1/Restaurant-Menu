"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PresentationModeProps {
  onToggle: (enabled: boolean) => void;
}

export default function PresentationMode({ onToggle }: PresentationModeProps) {
  const [enabled, setEnabled] = useState(false);

  const toggle = () => {
    const newState = !enabled;
    setEnabled(newState);
    onToggle(newState);
  };

  return (
    <motion.button
      onClick={toggle}
      className="fixed bottom-4 right-4 z-50 glass rounded-full px-4 py-2 glow"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="text-sm font-medium text-white">
        {enabled ? "🎬 Presentation ON" : "🎬 Presentation OFF"}
      </span>
    </motion.button>
  );
}
