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
        className="group w-full max-w-md cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl transition-all duration-500 hover:border-white/30 hover:shadow-[0_0_40px_rgba(212,175,55,0.15)]"
      >
        {/* Image */}
        <div className="relative w-full h-56 overflow-hidden">
          <Image
            src={`/${imageSrc}`}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-4">
          <h3 className="text-xl md:text-2xl font-semibold text-white tracking-wide">
            {item.name}
          </h3>

          <p className="text-sm text-white/60 leading-relaxed">
            {item.description}
          </p>

          <p className="text-lg text-yellow-400 tracking-widest font-medium pt-2">
            ${item.price.toFixed(2)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}