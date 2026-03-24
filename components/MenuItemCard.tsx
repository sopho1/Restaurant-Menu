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
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
      whileHover={isAvailable ? { y: -15, scale: 1.02 } : {}}
      onClick={() => isAvailable && onClick?.()}
      className={cn(
        "group relative glass-morphism rounded-[2.5rem] overflow-hidden transition-all duration-500",
        isAvailable 
          ? "cursor-pointer hover:shadow-[0_20px_50px_rgba(245,158,11,0.1)]" 
          : "cursor-not-allowed opacity-75 grayscale-[0.6]"
      )}
    >
      {/* High-End Image Container */}
      <div className="relative h-[28rem] w-full overflow-hidden">
        <Image
          src={normalizedImage}
          alt={item.name}
          fill
          className={cn(
            "object-cover transition-transform duration-[1.5s] ease-out",
            isAvailable && "group-hover:scale-110"
          )}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
        <div className={cn(
          "absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-700",
          isAvailable && "group-hover:opacity-100"
        )} />
        
        {/* Category & Status Badges */}
        <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
          {isHot && (
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              className="bg-accent text-accent-foreground px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-xl"
            >
              <Flame size={12} fill="currentColor" />
              Signature
            </motion.div>
          )}
          <span className="glass px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md border border-white/10">
            {categoryLabel}
          </span>
        </div>

        {/* Big Unavailable Overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 z-30 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: -5 }}
              className="bg-white/95 px-10 py-5 rounded-2xl border-4 border-red-600 shadow-[0_25px_50px_rgba(220,38,38,0.4)] backdrop-blur-md"
            >
              <span className="text-4xl md:text-5xl font-black text-red-600 tracking-[0.4em] uppercase text-luxury italic drop-shadow-sm">
                Unavailable
              </span>
            </motion.div>
          </div>
        )}

        {/* Floating Price Tag */}
        <motion.div 
          className="absolute bottom-6 right-6 z-20"
          whileHover={isAvailable ? { scale: 1.1 } : {}}
        >
          <div className={cn(
            "bg-background/80 backdrop-blur-xl border border-accent/20 px-6 py-3 rounded-2xl shadow-2xl",
            !isAvailable && "opacity-50 grayscale"
          )}>
            <span className="text-2xl font-bold text-gold-gradient block leading-tight">
              {item.price}<span className="text-xs ml-1 font-medium text-muted-foreground uppercase">Etb</span>
            </span>
          </div>
        </motion.div>
      </div>

      {/* Content Section */}
      <div className="p-8 md:p-10 relative -mt-16 z-20">
        <div className="mb-6">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className={cn("flex items-center gap-1 text-accent mb-4", !isAvailable && "opacity-40 grayscale")}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                size={14} 
                fill={i < (item.star || 5) ? "currentColor" : "none"} 
                className={cn(
                  "transition-all duration-300",
                  i < (item.star || 5) ? "scale-110 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "opacity-20"
                )} 
              />
            ))}
          </motion.div>

          <h3 className={cn(
            "text-3xl md:text-4xl font-bold tracking-tight text-luxury transition-colors duration-500 mb-4 leading-tight",
            isAvailable ? "group-hover:text-accent" : "text-muted-foreground"
          )}>
            {item.name}
          </h3>
          
          <p className={cn(
            "text-base md:text-lg line-clamp-2 md:line-clamp-2 font-light leading-relaxed mb-6 transition-colors duration-500",
            isAvailable ? "text-muted-foreground group-hover:text-foreground/80" : "text-muted-foreground/50"
          )}>
            {item.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-border/50">
          <div className="flex items-center gap-2">
             <div className={cn("w-2 h-2 rounded-full", isAvailable ? "bg-emerald-400 animate-pulse" : "bg-rose-500")} />
             <span className={cn(
               "text-[10px] font-bold uppercase tracking-[0.2em]",
               isAvailable ? "text-emerald-400/80" : "text-rose-500/80"
             )}>
               {isAvailable ? "Now Available" : "Unavailable"}
             </span>
          </div>
          
          {isAvailable ? (
            <button className="text-accent hover:text-white transition-colors duration-300 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 group/btn">
              View Details
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                →
              </motion.span>
            </button>
          ) : (
            <span className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">
              Check Back Later
            </span>
          )}
        </div>
      </div>
      
      {/* Decorative Border Glow */}
      <div className={cn(
        "absolute inset-0 border-[1px] border-white/5 rounded-[2.5rem] transition-all duration-700 pointer-events-none",
        isAvailable && "group-hover:border-accent/30"
      )} />
    </motion.article>
  );
}
