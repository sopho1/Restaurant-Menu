"use client";

import { motion } from "framer-motion";
import { type MenuItem } from "@/lib/types";
import { MenuItemCard } from "./MenuItemCard";

interface MenuCategoryProps {
  category: {
    id: string;
    name: string;
    icon?: string;
    items: any[];
  };
  onItemClick: (item: any) => void;
}

export default function MenuCategory({
  category,
  onItemClick,
}: MenuCategoryProps) {
  return (
    <section id={category.id} className="section-padding">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 md:mb-24 flex flex-col items-center text-center"
        >
          {category.icon && (
            <div className="w-16 h-16 rounded-full glass flex items-center justify-center text-2xl mb-8 animate-float">
              {category.icon}
            </div>
          )}
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-luxury text-gold-gradient">
            {category.name}
          </h2>
          
          <div className="w-24 h-1 bg-accent rounded-full mb-8" />
          
          <p className="text-muted-foreground max-w-2xl text-lg font-light tracking-wide">
            Explore our meticulously crafted {category.name.toLowerCase()}, where tradition meets innovation in every bite.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {category.items.map((item, index) => (
            <MenuItemCard
              key={item.id}
              item={{ 
                ...item, 
                category: { id: category.id, name: category.name } 
              }}
              index={index}
              onClick={() => onItemClick(item)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
