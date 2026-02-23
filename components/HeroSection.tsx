"use client";

import { motion, AnimatePresence, type Easing } from "framer-motion";
import { useEffect, useState } from "react";
import FoodImage from "./FoodImage";
import menuData from "@/data/menu.json";

interface HeroSectionProps {
  restaurantName: string;
  tagline: string;
  onScrollDown: () => void;
}

// Use real menu items for hero rotation (mains)
const heroItemIds = ["wagyu-steak", "truffle-pasta", "sushi-platter"] as const;

function getHeroItem(id: string) {
  for (const cat of menuData.categories) {
    const item = cat.items.find((i) => i.id === id);
    if (item) return item;
  }
  return menuData.categories[1]?.items[0] ?? { id: "wagyu-steak", name: "Dish", image: "steak" };
}

const easeOutExpo: Easing = [0.16, 1, 0.3, 1];

export default function HeroSection({
  restaurantName,
  tagline,
  onScrollDown,
}: HeroSectionProps) {
  const [index, setIndex] = useState(0);
  const itemId = heroItemIds[index % heroItemIds.length];
  const heroItem = getHeroItem(itemId);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => i + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={itemId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: easeOutExpo }}
            className="absolute inset-0"
          >
            <FoodImage
              item={heroItem}
              fill
              priority
              sizes="100vw"
              className="absolute inset-0"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/50 gradient-veil-hero opacity-80" aria-hidden />
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: easeOutExpo }}
          className="text-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white mb-8 tracking-tight"
        >
          <span className="text-gradient-gold">{restaurantName}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: easeOutExpo }}
          className="text-heading text-xl sm:text-2xl md:text-3xl text-[var(--foreground-muted)] font-light tracking-wide mb-16 max-w-2xl mx-auto leading-relaxed"
        >
          {tagline}
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: easeOutExpo }}
          whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(212, 175, 55, 0.25)" }}
          whileTap={{ scale: 0.98 }}
          onClick={onScrollDown}
          className="glass rounded-full px-10 py-4 text-lg font-medium text-white border-[var(--glass-border-hover)] hover:border-[var(--accent-gold)]/30 transition-colors duration-300"
        >
          View Menu
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.button
          onClick={onScrollDown}
          aria-label="Scroll to menu"
          className="flex flex-col items-center gap-2 text-white/60 hover:text-white/90 transition-colors duration-300"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 rounded-full border-2 border-current flex items-start justify-center pt-2"
          >
            <motion.div
              animate={{ y: [0, 10, 0], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-2.5 bg-current rounded-full"
            />
          </motion.div>
          <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
        </motion.button>
      </motion.div>
    </section>
  );
}
