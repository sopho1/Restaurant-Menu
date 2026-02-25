"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MenuItem } from "@/lib/types";

interface MenuItemCardProps {
  item: MenuItem;
  index: number;
  onClick: () => void;
}

/* -------------------------------- */
/* Manual Image Mapping (MVP Clean) */
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

export default function MenuItemCard({
  item,
  index,
  onClick,
}: MenuItemCardProps) {
  const imageSrc = imageMap[item.id] ?? "burg.jpg";

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