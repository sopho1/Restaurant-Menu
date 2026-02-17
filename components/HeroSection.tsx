"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import FoodModel3D from "./FoodModel3D";

interface HeroSectionProps {
  restaurantName: string;
  tagline: string;
  onScrollDown: () => void;
}

const heroFoodItems = ["wagyu-steak", "truffle-pasta", "sushi-platter"];

export default function HeroSection({
  restaurantName,
  tagline,
  onScrollDown,
}: HeroSectionProps) {
  const [currentFoodIndex, setCurrentFoodIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFoodIndex((prev) => (prev + 1) % heroFoodItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <FoodModel3D
          itemId={heroFoodItems[currentFoodIndex]}
          itemName={heroFoodItems[currentFoodIndex]}
        />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight"
        >
          {restaurantName}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-300 mb-12"
        >
          {tagline}
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onScrollDown}
          className="glass rounded-full px-8 py-4 text-lg font-semibold text-white glow hover:glow-lg transition-all duration-300"
        >
          View Menu
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, repeat: Infinity, repeatType: "reverse", duration: 2 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-3 bg-white/50 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
