"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Flame, Star } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type MenuCardProps = {
  item: any; // Using any briefly to handle both types, but will be careful
  index?: number;
  onClick?: () => void;
};

export function MenuItemCard({ item, index = 0, onClick }: MenuCardProps) {
  const categoryLabel = item.category?.name || "Premium Selection";
  const isHot = item.isHot || false;
  const isAvailable = item.isAvailable !== false; // Default to true if undefined (JSON items)

  const defaultImage = "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80";
  const normalizedImage = item.image
    ? item.image.startsWith("http") || item.image.startsWith("/")
      ? item.image
      : defaultImage
    : defaultImage;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      onClick={onClick}
      className={cn(
        "group relative cursor-pointer glass-morphism rounded-3xl overflow-hidden transition-all duration-500",
        !isAvailable && "opacity-60 grayscale-[0.5]"
      )}
    >
      {/* High-End Image Container */}
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={normalizedImage}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-40" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="glass px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-white/90">
            {categoryLabel}
          </span>
        </div>

        {/* Hot Badge */}
        {isHot && (
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-accent/90 text-accent-foreground p-2 rounded-full shadow-lg">
              <Flame size={16} fill="currentColor" />
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 md:p-8">
        <div className="flex justify-between items-start gap-4 mb-4">
          <h3 className="text-xl md:text-2xl font-bold tracking-tight text-luxury group-hover:text-accent transition-colors duration-300">
            {item.name}
          </h3>
          <div className="flex flex-col items-end">
            <span className="text-xl font-bold text-accent">
              ETB {item.price}
            </span>
          </div>
        </div>

        <p className="text-muted-foreground text-sm md:text-base line-clamp-2 md:line-clamp-3 mb-6 font-light leading-relaxed">
          {item.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-accent/60">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                size={14} 
                fill={i < (item.star || 5) ? "currentColor" : "none"} 
                className={i < (item.star || 5) ? "" : "opacity-40"} 
              />
            ))}
          </div>
          
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-[0.2em]",
            isAvailable ? "text-emerald-400" : "text-rose-400"
          )}>
            {isAvailable ? "Available Now" : "Coming Back Soon"}
          </span>
        </div>
      </div>
      
      {/* Premium Border Hover Effect */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent/20 rounded-3xl transition-colors duration-500 pointer-events-none" />
    </motion.article>
  );
}
