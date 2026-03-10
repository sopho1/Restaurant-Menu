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
      <div className="flex flex-col gap-40 md:gap-56 lg:gap-72">
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

      {/* Spacer to prevent menu and footer from touching */}
      <div className="h-28 md:h-24 lg:h-28 w-full" aria-hidden="true" />

      <footer className="relative z-10 w-full py-20 mb-12 md:mb-20 border-t border-white/10 flex items-center justify-center">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12">

          {/* Gradient Divider */}
          <div className="flex justify-center mb-16">
            <div className="w-36 h-[2px] bg-gradient-to-r from-transparent via-yellow-500/70 to-transparent" />
          </div>

          {/* Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-32 lg:gap-48 items-start">

            {/* Brand Section */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h3 className="text-white text-xl font-semibold tracking-wide mb-4">
                {menuData.restaurant.name}
              </h3>

              <p className="text-white/50 text-sm leading-relaxed max-w-sm">
                Experience our digital menu and explore a curated selection of
                dishes crafted with passion, quality ingredients, and authentic
                culinary artistry.
              </p>
            </div>

            {/* Social Section */}
            <div className="flex flex-col items-center md:items-end text-center md:text-right">
              <p className="text-xs uppercase tracking-[0.35em] text-white/40 mb-5">
                Connect With Us
              </p>

              <div className="flex gap-6 text-white/60 text-sm font-light">

                <a
                  href="https://www.instagram.com/anna_galleria_rest?igsh=bDg3M3JmcGtrYml4"
                  className="hover:text-yellow-400 transition duration-300"
                >
                  Instagram
                </a>

                <a
                  href="https://tiktok.com/@anna.galleria.res"
                  className="hover:text-yellow-400 transition duration-300"
                >
                  TikTok
                </a>

                <a
                  href="https://annagalleria.vercel.app"
                  className="hover:text-yellow-400 transition duration-300"
                >
                  Website
                </a>

              </div>
            </div>

          </div>

          {/* Bottom Footer */}
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">

            <p className="text-xs uppercase tracking-[0.35em] text-white/30">
              Digital Menu Experience
            </p>

            <p className="text-sm text-white/40 font-light">
              © {new Date().getFullYear()} {menuData.restaurant.name}. All rights reserved.
            </p>

          </div>

        </div>
      </footer>
    </main>
  );
}
