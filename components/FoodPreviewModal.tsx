"use client";

import { motion, AnimatePresence, type Variants } from "framer-motion";
import { MenuItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
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
  "truffle-arugula": "burg.jpg",
  "wagyu-tartare": "burg1.jpg",
  "lobster-bisque": "burg2.jpg",
  "foie-gras": "burg3.jpg",

  "wagyu-steak": "burg4.jpg",
  "lobster-thermidor": "burg1.jpg",
  "duck-confit": "burg2.jpg",
  "truffle-pasta": "burg3.jpg",
  "sushi-platter": "burg4.jpg",

  "chocolate-souffle": "burg1.jpg",
  "creme-brulee": "burg2.jpg",
  "tiramisu": "burg3.jpg",
  "berry-tart": "burg4.jpg",

  "wine-flight": "burg1.jpg",
  "signature-cocktail": "burg2.jpg",
  "whiskey-tasting": "burg3.jpg",
  "champagne": "burg4.jpg",
  "mocktail": "burg1.jpg",
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
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-50"
          />

          {/* Modal Panel */}
          <motion.div
            variants={panel}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-4 md:inset-16 lg:inset-24 z-50 glass rounded-3xl overflow-hidden border border-white/10"
          >
            <div className="h-full flex flex-col md:flex-row">

              {/* Image Side */}
              <div className="w-full md:w-1/2 h-72 md:h-full relative bg-black/40 min-h-[18rem]">
                <Image
                  src={`/${imageSrc}`}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* Content Side */}
              <div className="flex-1 p-8 md:p-14 flex items-center justify-center relative">
                {/* Close Button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  onClick={onClose}
                  className="absolute top-8 cursor-pointer right-8 w-12 h-12 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center text-white hover:scale-105 transition-transform duration-300 border border-white/10"
                  aria-label="Close"
                >
                  ✕
                </motion.button>

                {/* Centered Content */}
                <div className="flex flex-col items-start justify-center gap-8 max-w-xl">
                  <motion.h2
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight"
                  >
                    {item.name}
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.18, duration: 0.5 }}
                    className="text-lg md:text-xl text-white/70 leading-relaxed"
                  >
                    {item.description}
                  </motion.p>

                  <motion.span
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.28 }}
                    className="text-3xl md:text-4xl font-semibold text-yellow-400"
                  >
                    {formatPrice(item.price)}
                  </motion.span>
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}