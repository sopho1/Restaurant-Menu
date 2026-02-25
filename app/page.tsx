"use client";

import { useState } from "react";
import menuData from "@/data/menu.json";
import { MenuItem } from "@/lib/types";
import HeroSection from "@/components/HeroSection";
import MenuCategory from "@/components/MenuCategory";
import FoodPreviewModal from "@/components/FoodPreviewModal";
import TableBadge from "@/components/TableBadge";
import Particles from "@/components/Particles";

export default function Home() {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleScrollDown = () => {
    const firstCategory = document.getElementById(menuData.categories[0].id);
    firstCategory?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="relative min-h-screen bg-black text-white overflow-x-hidden">
      <Particles />
      <TableBadge />

      <HeroSection
        restaurantName={menuData.restaurant.name}
        tagline={menuData.restaurant.tagline}
        onScrollDown={handleScrollDown}
      />
    <div className="flex flex-col gap-40">
      {menuData.categories.map((category) => (
        <MenuCategory
          key={category.id}
          category={category}
          onItemClick={handleItemClick}
        />
      ))}
      </div>
      <FoodPreviewModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTimeout(() => setSelectedItem(null), 300);
        }}
      />

      <footer className="pt-32 md:pt-40 lg:pt-56 pb-20 flex items-center justify-center border border-yellow-500">
        <div className="max-w-8xl max-h-5xl glass rounded-3xl border border-white/10 bg-gradient-to-t from-white/5 to-transparent text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-gray-500 mb-3">
            Digital Menu Experience
          </p>
          <p className="text-sm tracking-wide text-gray-400">
            © {new Date().getFullYear()} {menuData.restaurant.name}. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
