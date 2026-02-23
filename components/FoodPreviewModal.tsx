"use client";

import { motion, AnimatePresence, type Variants } from "framer-motion";
import { MenuItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import FoodImage from "./FoodImage";
import { useEffect } from "react";

interface FoodPreviewModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const backdrop: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const panel: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 24,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export default function FoodPreviewModal({
  item,
  isOpen,
  onClose,
}: FoodPreviewModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!item) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            variants={backdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-50"
          />
          <motion.div
            variants={panel}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-4 md:inset-16 lg:inset-24 z-50 glass rounded-3xl overflow-hidden border border-[var(--glass-border)]"
          >
            <div className="h-full flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 h-72 md:h-full relative bg-black/40 min-h-[18rem]">
                <FoodImage item={item} fill sizes="(max-width: 768px) 100vw, 50vw" className="absolute inset-0" />
              </div>

              <div className="flex-1 p-8 md:p-14 flex flex-col justify-between overflow-y-auto">
                <div>
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    onClick={onClose}
                    className="absolute top-8 right-8 w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:scale-105 transition-transform duration-300 border border-[var(--glass-border)]"
                    aria-label="Close"
                  >
                    ✕
                  </motion.button>

                  <motion.h2
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="text-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight"
                  >
                    {item.name}
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.18, duration: 0.5 }}
                    className="text-lg md:text-xl text-[var(--foreground-muted)] leading-relaxed max-w-xl"
                  >
                    {item.description}
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28 }}
                  className="flex items-center justify-between gap-6 pt-8 mt-8 border-t border-[var(--glass-border)]"
                >
                  <span className="text-3xl md:text-4xl font-semibold text-[var(--accent-gold)]">
                    {formatPrice(item.price)}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="glass rounded-full px-10 py-4 text-white font-medium border border-[var(--glass-border-hover)] hover:border-[var(--accent-gold)]/30 transition-colors duration-300"
                  >
                    Add to Order
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
