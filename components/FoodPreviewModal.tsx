"use client";

import { motion, AnimatePresence, type Variants } from "framer-motion";
import { MenuItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import ThreeDImage from "./ThreeDImage";
import { useEffect } from "react";

interface FoodPreviewModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

/* -------------------------------- */
/* Manual Image Mapping (Same as Card) */
/* -------------------------------- */

const imageMap: Record<string, string> = {
  "lasagna": "burg.jpg",
  "Tempura roll": "burg1.jpg",
  "Pasta combo": "burg2.jpg",
  "Orange Chicken": "burg3.jpg",

  // Mains
  "Fasting Combo": "burg4.jpg",
  "BBQ Chicken Wings": "burg5.jpg",
  "Special Pizza": "burg.jpg",
  "Special Burger": "burg1.jpg",
  "Fish and Chips": "burg2.jpg",

  // Desserts
  "Chocolate Soufflé": "burg3.jpg",
  "Vanilla Crème Brûlée": "burg4.jpg",
  "Artisan Tiramisu": "burg5.jpg",
  "Mixed Berry Tart": "burg.jpg",

  // Drinks
  "Wine Flight": "burg1.jpg",
  "Signature Cocktail": "burg2.jpg",
  "Premium Whiskey Tasting": "burg3.jpg",
  "Dom Pérignon": "burg4.jpg",
  "Artisan Mocktail": "burg5.jpg",
};

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
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 24,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
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

  const imageSrc = imageMap[item.id] ?? "burg.jpg";

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50"
          />

          {/* Modal Panel */}
          <motion.div
            variants={panel}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-4 md:inset-12 lg:inset-20 z-50 bg-black/40 backdrop-blur-2xl rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)]"
          >
            <div className="h-full flex flex-col md:flex-row">

              {/* Image Side */}
              <div className="w-full md:w-1/2 lg:w-[45%] h-[40vh] md:h-full relative bg-black">
                <ThreeDImage src={`/${imageSrc}`} alt={item.name} />
              </div>

              {/* Content Side */}
              <div className="flex-1 p-8 md:p-16 lg:p-24 flex items-center justify-center relative">
                {/* Close Button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  onClick={onClose}
                  className="absolute top-6 right-6 md:top-10 md:right-10 w-14 h-14 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 hover:scale-105 transition-all duration-300 border border-white/5"
                  aria-label="Close"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </motion.button>

                {/* Centered Content */}
                <div className="flex flex-col items-start justify-center gap-8 max-w-2xl w-full">
                  <div className="space-y-4 w-full">
                    <motion.h2
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15, duration: 0.6, ease: "easeOut" }}
                      className="text-5xl md:text-6xl lg:text-7xl font-light text-white tracking-tighter"
                    >
                      {item.name}
                    </motion.h2>
                  </div>

                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="w-24 h-[1px] bg-gradient-to-r from-yellow-500/50 to-transparent my-2 origin-left"
                  />

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.6 }}
                    className="text-lg md:text-xl lg:text-2xl text-white/50 leading-relaxed font-light"
                  >
                    {item.description}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.6 }}
                    className="mt-8 pt-10 border-t border-white/10 w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                  >
                    <span className="text-4xl md:text-5xl lg:text-6xl font-light text-white flex items-baseline gap-2">
                      {formatPrice(item.price)}
                    </span>
                  </motion.div>
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}