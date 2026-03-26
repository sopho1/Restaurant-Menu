"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

interface HeroSectionProps {
  restaurantName: string;
  tagline: string;
  onScrollDown: () => void;
  onStoryClick?: () => void;
  heroImages?: string[];
  logo?: string;
}

const defaultHeroImages = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1887&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?q=80&w=1980&auto=format&fit=crop",
];

export default function HeroSection({
  restaurantName,
  tagline,
  onScrollDown,
  onStoryClick,
  heroImages = defaultHeroImages,
  logo = "/logo.jpg",
}: HeroSectionProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => i + 1);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Slider */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={heroImages[index % heroImages.length]}
              alt="Culinary excellence"
              fill
              priority
              className="object-cover brightness-50"
            />
          </motion.div>
        </AnimatePresence>
        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-12 inline-block"
        >
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border border-white/10 glass p-2 shadow-2xl animate-float">
            <div className="relative w-full h-full rounded-full overflow-hidden">
              <Image
                src={logo}
                alt={restaurantName}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold mb-6 tracking-tight text-luxury text-gold-gradient">
            {restaurantName}
          </h1>
          
          <p className="text-lg md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto font-light tracking-wide px-4">
            {tagline}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onScrollDown}
              className="px-8 py-4 bg-accent text-accent-foreground rounded-full font-semibold tracking-widest uppercase text-sm hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all duration-300 min-w-[200px]"
            >
              Explore Menu
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
        onClick={onScrollDown}
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Discover</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-6 h-6 text-accent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
