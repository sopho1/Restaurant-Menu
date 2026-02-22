"use client";

import { motion } from "framer-motion";
import { MenuItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import FoodImage from "./FoodImage";

interface MenuItemCardProps {
  item: MenuItem;
  index: number;
  onClick: () => void;
}

export default function MenuItemCard({
  item,
  index,
  onClick,
}: MenuItemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{
        y: -6,
        transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
      }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="group glass rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:border-[var(--glass-border-hover)] w-full"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <FoodImage item={item} fill sizes="(max-width: 768px) 100vw, 50vw" />
      </div>
      <div className="flex flex-col gap-4 p-8">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-heading text-2xl font-semibold text-white tracking-tight">
            {item.name}
          </h3>
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 + 0.15, duration: 0.4 }}
            className="text-xl font-semibold text-[var(--accent-gold)] shrink-0"
          >
            {formatPrice(item.price)}
          </motion.span>
        </div>
        <p className="text-[var(--foreground-muted)] text-base leading-relaxed">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}
