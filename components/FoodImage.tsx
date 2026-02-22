"use client";

import { getFoodImageUrl } from "@/lib/foodImages";

interface FoodImageProps {
  item: { id: string; image?: string; name?: string };
  priority?: boolean;
  sizes?: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
}

export default function FoodImage({
  item,
  priority = false,
  className = "",
  fill = true,
  width = 800,
  height = 600,
}: FoodImageProps) {
  const src = getFoodImageUrl(item);
  const alt = item.name ?? "Dish";
  const loading = priority ? "eager" : "lazy";

  if (fill) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          loading={loading}
          decoding="async"
        />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`object-cover ${className}`}
      loading={loading}
      decoding="async"
    />
  );
}
