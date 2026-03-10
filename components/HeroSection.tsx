"use client";

import { motion, AnimatePresence, type Easing } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

interface HeroSectionProps {
  restaurantName: string;
  tagline: string;
  onScrollDown: () => void;
}

const heroImages = [
  "/burg.jpg",
  "/burg1.jpg",
  "/burg2.jpg",
  "/burg3.jpg",
];

const easeOutExpo: Easing = [0.16, 1, 0.3, 1];

export default function HeroSection({
  restaurantName,
  tagline,
  onScrollDown,
}: HeroSectionProps) {
  const [index, setIndex] = useState(0);
  const imageSrc = heroImages[index % heroImages.length];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => i + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background Images */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={imageSrc}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: easeOutExpo }}
            className="absolute inset-0"
          >
            <Image
              src={imageSrc}
              alt="Luxury dish background"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto gap-8 flex flex-col items-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeOutExpo }}
          className="mb-6"
        >
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full overflow-hidden border border-white/20 bg-white/5 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.6)]">
            <Image
              src="/logo.jpg"
              alt={`${restaurantName} logo`}
              fill
              sizes="144px"
              className="object-cover"
              priority
            />
          </div>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: easeOutExpo }}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-light text-white mb-6 tracking-tighter"
        >
          <span className="bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
            {restaurantName}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: easeOutExpo }}
          className="text-xl sm:text-2xl md:text-3xl text-white/80 font-light tracking-wide mb-16  text-center justify-center items-center flex flex-col"
        >
          {tagline}
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: easeOutExpo }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={onScrollDown}
          className="rounded-full cursor-pointer px-10 py-5 md:px-14 md:py-6 text-sm md:text-base tracking-[0.2em] uppercase font-medium text-white border border-white/20 hover:border-yellow-500 hover:bg-yellow-500 hover:text-black transition-all duration-500 backdrop-blur-md bg-white/5 shadow-[0_0_40px_rgba(255,255,255,0.05)] hover:shadow-[0_0_60px_rgba(234,179,8,0.3)]"
        >
          View Menu
        </motion.button>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.button
          onClick={onScrollDown}
          aria-label="Scroll to menu"
          className="flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors duration-300"
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
          <span className="text-xs font-medium tracking-widest uppercase">
            Scroll
          </span>
        </motion.button>
      </motion.div>
    </section>
  );
}