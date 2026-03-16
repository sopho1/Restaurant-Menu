"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MenuItem } from "@/lib/types";
import ThreeDImage from "./ThreeDImage";
import { useEffect } from "react";
import { X, Flame, Star, Sparkles } from "lucide-react";

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

  const normalizedImage = item.image && (item.image.startsWith("http") || item.image.startsWith("/")) 
    ? item.image 
    : "/burg.jpg";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Immersive Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[100]"
          />

          {/* Luxury Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-12 lg:inset-20 xl:inset-32 z-[101] glass-morphism rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_120px_rgba(0,0,0,0.8)] flex flex-col md:flex-row"
          >
            {/* Visual Experience Side */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full relative bg-black/40 border-b md:border-b-0 md:border-r border-white/5">
              <ThreeDImage src={normalizedImage} alt={item.name} />
              
              {/* Overlay Badges */}
              <div className="absolute top-8 left-8 flex flex-col gap-3">
                 <div className="glass px-4 py-2 rounded-2xl flex items-center gap-2">
                    <Sparkles size={16} className="text-accent" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Culinary Art</span>
                 </div>
              </div>
            </div>

            {/* Content & Details Side */}
            <div className="flex-1 p-8 md:p-16 lg:p-20 relative flex flex-col justify-center">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-8 right-8 w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:scale-110 transition-all duration-300"
              >
                <X size={20} />
              </button>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-xl"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Star size={12} fill="currentColor" className="text-accent" />
                  <Star size={12} fill="currentColor" className="text-accent" />
                  <Star size={12} fill="currentColor" className="text-accent" />
                  <Star size={12} fill="currentColor" className="text-accent" />
                  <Star size={12} fill="currentColor" className="text-accent" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 ml-2">Signature Dish</span>
                </div>

                <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 text-luxury text-gold-gradient leading-[1.1]">
                  {item.name}
                </h2>

                <div className="w-24 h-1 bg-accent rounded-full mb-10" />

                <p className="text-foreground-muted text-lg md:text-xl font-light leading-relaxed mb-12">
                  {item.description}
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 pt-10 border-t border-white/5">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 mb-2">Price Estimate</span>
                    <span className="text-4xl md:text-5xl font-bold text-accent">
                      ETB {item.price}
                    </span>
                  </div>

                  <button 
                    onClick={onClose}
                    className="px-10 py-5 bg-white text-black rounded-full font-bold uppercase tracking-widest text-xs hover:bg-accent hover:text-accent-foreground transition-all duration-300 shadow-xl"
                  >
                    Close Preview
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}