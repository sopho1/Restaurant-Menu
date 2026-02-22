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

      {menuData.categories.map((category) => (
        <MenuCategory
          key={category.id}
          category={category}
          onItemClick={handleItemClick}
        />
      ))}

      <FoodPreviewModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTimeout(() => setSelectedItem(null), 300);
        }}
      />

      <footer className="py-16 px-6 text-center text-[var(--foreground-muted)]">
        <p className="text-sm tracking-wide">
          © {new Date().getFullYear()} {menuData.restaurant.name}. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
