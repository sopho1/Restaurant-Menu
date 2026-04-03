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
  const isAvailable = item.isAvailable !== false;

  const defaultImage = "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80";
  const normalizedImage = item.image
    ? item.image.startsWith("http") || item.image.startsWith("/")
      ? item.image
      : defaultImage
    : defaultImage;

  return (
    <motion.article
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={isAvailable ? { scale: 1.02, x: 5 } : {}}
      onClick={() => isAvailable && onClick?.()}
      className={cn(
        "group relative glass-morphism rounded-2xl overflow-hidden transition-all duration-300",
        isAvailable
          ? "cursor-pointer hover:bg-white/[0.05] hover:shadow-xl"
          : "cursor-not-allowed opacity-60 grayscale-[0.6]"
      )}
    >
      <div className="flex flex-row items-stretch gap-3 md:gap-4 p-2 md:p-3">
        {/* Even More Compact Image Container */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 overflow-hidden rounded-xl flex-shrink-0">
          <Image
            src={normalizedImage}
            alt={item.name}
            fill
            className={cn(
              "object-cover transition-transform duration-700",
              isAvailable && "group-hover:scale-110"
            )}
            sizes="(max-width: 640px) 100px, 130px"
          />

          {/* Overlay for Unavailable */}
          {!isAvailable && (
            <div className="absolute inset-0 z-10 bg-black/40 flex items-center justify-center">
              <span className="text-white font-bold text-[7px] uppercase tracking-widest bg-red-600/80 px-1.5 py-0.5 rounded">
                Sold Out
              </span>
            </div>
          )}

          {/* Signature Badge on Image */}
          {isHot && isAvailable && (
            <div className="absolute top-1 left-1 z-10">
              <div className="bg-accent text-white p-1 rounded-md shadow-lg">
                <Flame size={10} fill="currentColor" />
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-grow flex flex-col justify-center min-w-0 py-1">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-0.5 mb-1">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-0 flex-wrap">
                <h3 className={cn(
                  "text-base md:text-xl font-bold tracking-tight text-luxury truncate transition-colors duration-300",
                  isAvailable ? "group-hover:text-accent" : "text-muted-foreground"
                )}>
                  {item.name}
                </h3>
                {isHot && (
                  <span className="bg-accent/10 text-accent text-[6px] md:text-[7px] font-bold uppercase tracking-widest px-1 py-0.5 rounded-full border border-accent/20 flex-shrink-0">
                    Hot
                  </span>
                )}
              </div>

              <div className={cn("flex items-center gap-0.5 text-accent/60 mb-0.5", !isAvailable && "opacity-40")}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={8}
                    fill={i < (item.star || 5) ? "currentColor" : "none"}
                    className={cn(
                      i < (item.star || 5) ? "drop-shadow-[0_0_2px_rgba(239,68,68,0.3)]" : "opacity-10"
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-baseline gap-1 flex-shrink-0">
              <span className="text-lg md:text-xl font-bold text-gold-gradient">
                {item.price}<span className="text-[8px] md:text-[9px] ml-0.5 font-medium text-muted-foreground uppercase">Etb</span>
              </span>
            </div>
          </div>

          <p className={cn(
            "text-[10px] md:text-sm font-light leading-snug mb-2 line-clamp-1 md:line-clamp-2",
            isAvailable ? "text-muted-foreground" : "text-muted-foreground/50"
          )}>
            {item.description}
          </p>

          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-1">
              <div className={cn("w-1 h-1 rounded-full", isAvailable ? "bg-emerald-400" : "bg-rose-500")} />
              <span className={cn(
                "text-[7px] md:text-[8px] font-bold uppercase tracking-[0.05em]",
                isAvailable ? "text-emerald-400/60" : "text-rose-500/60"
              )}>
                {isAvailable ? "Available" : "Sold Out"}
              </span>
            </div>

            {isAvailable && (
              <span className="text-accent group-hover:translate-x-0.5 transition-transform duration-300 font-bold uppercase text-[7px] md:text-[8px] tracking-widest flex items-center gap-0.5">
                Details
                <span>→</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Subtle Border Glow */}
      <div className={cn(
        "absolute inset-0 border border-white/5 rounded-3xl transition-all duration-500 pointer-events-none group-hover:border-accent/20"
      )} />
    </motion.article>

  );
}
