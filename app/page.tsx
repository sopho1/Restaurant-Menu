"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import menuData from "@/data/menu.json";
import { MenuItem } from "@/lib/types";
import HeroSection from "@/components/HeroSection";
import MenuCategory from "@/components/MenuCategory";
import FoodPreviewModal from "@/components/FoodPreviewModal";
import TableBadge from "@/components/TableBadge";
import PresentationMode from "@/components/PresentationMode";
import Particles from "@/components/Particles";

export default function Home() {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [presentationMode, setPresentationMode] = useState(false);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleScrollDown = () => {
    const firstCategory = document.getElementById(menuData.categories[0].id);
    firstCategory?.scrollIntoView({ behavior: "smooth" });
  };

  // Presentation mode auto-scroll and auto-open
  useEffect(() => {
    if (!presentationMode) return;

    const interval = setInterval(() => {
      if (currentCategoryIndex < menuData.categories.length) {
        const category = menuData.categories[currentCategoryIndex];
        const item = category.items[currentItemIndex];

        if (item) {
          handleItemClick(item);
          setCurrentItemIndex((prev) => prev + 1);

          if (currentItemIndex >= category.items.length - 1) {
            setCurrentCategoryIndex((prev) => prev + 1);
            setCurrentItemIndex(0);
          }
        } else {
          setCurrentCategoryIndex((prev) => prev + 1);
          setCurrentItemIndex(0);
        }
      } else {
        // Reset and scroll to top
        setCurrentCategoryIndex(0);
        setCurrentItemIndex(0);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 5000); // Auto-open every 5 seconds

    return () => clearInterval(interval);
  }, [presentationMode, currentCategoryIndex, currentItemIndex]);

  return (
    <main className="relative min-h-screen bg-black text-white overflow-x-hidden">
      <Particles />
      <TableBadge />
      <PresentationMode onToggle={setPresentationMode} />

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
          presentationMode={presentationMode}
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

      <footer className="py-12 px-4 text-center text-gray-400">
        <p>© {new Date().getFullYear()} {menuData.restaurant.name}. All rights reserved.</p>
      </footer>
    </main>
  );
}
