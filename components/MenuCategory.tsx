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
    <section id={category.id} className="section-padding relative">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-16 md:mb-28 flex flex-col items-center text-center relative"
        >
          {/* Decorative Background Text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8rem] md:text-[12rem] font-bold text-foreground/[0.03] select-none pointer-events-none uppercase tracking-[0.2em] whitespace-nowrap z-0">
            {category.name}
          </div>

          <div className="relative z-10">
            <motion.span 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="text-accent font-bold uppercase tracking-[0.5em] text-[10px] mb-6 block"
            >
              Exquisite Selection
            </motion.span>
            
            <h2 className="text-5xl md:text-8xl font-bold mb-8 text-luxury text-gold-gradient relative inline-block">
              {category.name}
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ delay: 0.5, duration: 1 }}
                className="absolute -bottom-2 left-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent" 
              />
            </h2>
            
            <p className="text-muted-foreground max-w-xl text-lg md:text-xl font-light tracking-wide leading-relaxed mx-auto italic">
              "A symphony of flavors, curated for the most discerning palates."
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 max-w-7xl mx-auto">
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
