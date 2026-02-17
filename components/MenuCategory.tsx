"use client";

import { motion } from "framer-motion";
import { MenuCategory as MenuCategoryType, MenuItem } from "@/lib/types";
import MenuItemCard from "./MenuItemCard";

interface MenuCategoryProps {
  category: MenuCategoryType;
  onItemClick: (item: MenuItem) => void;
  presentationMode?: boolean;
}

export default function MenuCategory({
  category,
  onItemClick,
  presentationMode = false,
}: MenuCategoryProps) {
  return (
    <section id={category.id} className="py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex items-center gap-4 mb-12">
          <span className="text-4xl">{category.icon}</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            {category.name}
          </h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {category.items.map((item, index) => (
            <MenuItemCard
              key={item.id}
              item={item}
              index={index}
              onClick={() => onItemClick(item)}
              presentationMode={presentationMode}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
