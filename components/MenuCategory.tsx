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
      className="py-[var(--spacing-section)] px-6 md:px-8 flex justify-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl flex flex-col items-center text-center"
      >
        <div className="flex flex-col items-center gap-4 mb-16">
          <span className="text-4xl md:text-5xl opacity-90" aria-hidden>
            {category.icon}
          </span>
          <h2 className="text-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            {category.name}
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "center" }}
            className="w-24 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
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
