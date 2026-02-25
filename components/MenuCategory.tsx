"use client";

import { motion } from "framer-motion";
import { MenuCategory as MenuCategoryType, MenuItem } from "@/lib/types";
import MenuItemCard from "./MenuItemCard";

interface MenuCategoryProps {
  category: MenuCategoryType;
  onItemClick: (item: MenuItem) => void;
}

export default function MenuCategory({
  category,
  onItemClick,
}: MenuCategoryProps) {
  return (
    <section
      id={category.id}
      className="px-6 md:px-8 flex justify-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-6xl flex flex-col items-center text-center"
      >
        {/* Category Header */}
        <div className="flex flex-col items-center gap-4 mb-20">
          <span className="text-4xl md:text-5xl opacity-90">
            {category.icon}
          </span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            {category.name}
          </h2>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            style={{ transformOrigin: "center" }}
            className="w-24 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 w-full max-w-5xl">
          {category.items.map((item, index) => (
            <MenuItemCard
              key={item.id}
              item={item}
              index={index}
              onClick={() => onItemClick(item)}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}