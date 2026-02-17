"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MenuItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import FoodModel3D from "./FoodModel3D";
import { useEffect } from "react";

interface FoodPreviewModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

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
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed inset-4 md:inset-20 z-50 glass rounded-3xl overflow-hidden glow"
          >
            <div className="h-full flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 h-64 md:h-full relative bg-black/50">
                <FoodModel3D itemId={item.id} itemName={item.name} />
              </div>

              <div className="flex-1 p-8 md:p-12 flex flex-col justify-between overflow-y-auto">
                <div>
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    onClick={onClose}
                    className="absolute top-6 right-6 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:scale-110 transition-transform"
                  >
                    ✕
                  </motion.button>

                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-bold text-white mb-4"
                  >
                    {item.name}
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg text-gray-300 mb-8 leading-relaxed"
                  >
                    {item.description}
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-between"
                >
                  <span className="text-3xl font-bold text-yellow-400">
                    {formatPrice(item.price)}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="glass rounded-full px-8 py-3 text-white font-semibold glow hover:glow-lg transition-all"
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
