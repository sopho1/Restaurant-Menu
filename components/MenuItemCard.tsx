"use client";

import { motion } from "framer-motion";
import { MenuItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface MenuItemCardProps {
  item: MenuItem;
  index: number;
  onClick: () => void;
  presentationMode?: boolean;
}

export default function MenuItemCard({
  item,
  index,
  onClick,
  presentationMode = false,
}: MenuItemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={presentationMode ? undefined : onClick}
      className="glass rounded-2xl p-6 cursor-pointer glow hover:glow-lg transition-all duration-300"
    >
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-white">{item.name}</h3>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 + 0.2 }}
            className="text-lg font-bold text-yellow-400"
          >
            {formatPrice(item.price)}
          </motion.span>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}
