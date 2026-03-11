"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MenuItem } from "@/lib/types";

interface MenuItemCardProps {
  item: MenuItem;
  index: number;
  onClick: () => void;
}

// Map dish names from menu.json to local /burg images
const imageMap: Record<string, string> = {
  // Starters
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

export default function MenuItemCard({
  item,
  index,
  onClick,
}: MenuItemCardProps) {
  const imageSrc = imageMap[item.name] ?? "burg.jpg";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.08, duration: 0.6 }}
      className="w-full flex justify-center"
    >
      <div
        onClick={onClick}
        className="group w-[92%] sm:w-full mx-auto max-w-lg cursor-pointer flex flex-col overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.02] backdrop-blur-2xl transition-all duration-700 hover:border-white/20 hover:bg-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_60px_rgba(212,175,55,0.15)] hover:-translate-y-2"
      >
        {/* Image */}
        <div className="relative w-full h-72 md:h-80 overflow-hidden bg-black/50">
          <Image
            src={`/${imageSrc}`}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, 500px"
            className="object-cover transition-transform duration-1000 ease-[0.16,1,0.3,1] group-hover:scale-110 opacity-90 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-8 md:p-10 text-center flex flex-col gap-4 flex-1 justify-between">
          <div className="space-y-3">
            <h3 className="text-2xl md:text-3xl font-light text-white tracking-wide">
              {item.name}
            </h3>

            <p className="text-sm md:text-base text-white/50 leading-relaxed font-light">
              {item.description}
            </p>
          </div>

          <div className="pt-6 mt-4 border-t border-white/10 flex justify-center items-center">
            <p className="text-xl md:text-2xl text-yellow-500 tracking-[0.2em] font-light">
              ETB {item.price.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}