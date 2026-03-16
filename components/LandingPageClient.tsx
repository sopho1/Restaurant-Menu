"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import MenuCategory from "@/components/MenuCategory";
import FoodPreviewModal from "@/components/FoodPreviewModal";
import TableBadge from "@/components/TableBadge";

interface LandingPageClientProps {
  restaurant: {
    name: string;
    tagline: string;
    logo?: string;
  };
  categories: any[];
  heroImages?: string[];
}

export default function LandingPageClient({ restaurant, categories, heroImages }: LandingPageClientProps) {
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <main className="relative min-h-screen bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-accent z-[100] origin-left"
        style={{ scaleX }}
      />

      <TableBadge />

      {/* Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 border-b ${
          isScrolled 
            ? "glass py-4 border-white/10" 
            : "bg-transparent py-8 border-transparent"
        }`}
      >
        <div className="container-custom flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-luxury text-gold-gradient cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            {restaurant.name.split(' ')[0]}<span className="text-white">.</span>
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleScrollTo(cat.id)}
                className="text-sm font-bold uppercase tracking-[0.2em] text-foreground-muted hover:text-accent transition-colors duration-300"
              >
                {cat.name}
              </button>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-accent-foreground transition-all duration-300"
          >
            Book Table
          </motion.button>
        </div>
      </nav>

      <HeroSection
        restaurantName={restaurant.name}
        tagline={restaurant.tagline}
        logo={restaurant.logo}
        heroImages={heroImages}
        onScrollDown={() => categories.length > 0 && handleScrollTo(categories[0].id)}
      />

      <div className="relative z-10">
        {categories.map((category) => (
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

      {/* Footer */}
      <footer className="relative z-10 bg-black pt-24 pb-12 border-t border-white/5">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
            <div className="md:col-span-2">
              <h3 className="text-3xl font-bold text-luxury text-gold-gradient mb-8">
                {restaurant.name}
              </h3>
              <p className="text-foreground-muted text-lg font-light leading-relaxed max-w-md">
                We believe that food is an experience, and our digital menu is just the beginning of your journey with us. Every dish is a story of tradition, passion, and excellence.
              </p>
            </div>
            
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.4em] text-white mb-8">Navigation</h4>
              <ul className="flex flex-col gap-4">
                {categories.map(cat => (
                  <li key={cat.id}>
                    <button 
                      onClick={() => handleScrollTo(cat.id)}
                      className="text-foreground-muted hover:text-accent transition-colors duration-300 text-sm"
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.4em] text-white mb-8">Social</h4>
              <ul className="flex flex-col gap-4">
                <li><a href="#" className="text-foreground-muted hover:text-accent transition-colors duration-300 text-sm">Instagram</a></li>
                <li><a href="#" className="text-foreground-muted hover:text-accent transition-colors duration-300 text-sm">Facebook</a></li>
                <li><a href="#" className="text-foreground-muted hover:text-accent transition-colors duration-300 text-sm">Twitter</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/5 gap-8">
            <p className="text-foreground-muted text-xs tracking-widest uppercase">
              © {new Date().getFullYear()} {restaurant.name}. Crafted with Excellence.
            </p>
            <div className="flex gap-12 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
              <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
