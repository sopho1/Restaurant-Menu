"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useTheme } from "next-themes";
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
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();

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

  // Sort categories: starters, mains, desserts, drinks
  const sortedCategories = [...categories].sort((a, b) => {
    const order = ['starters', 'mains', 'desserts', 'drinks'];
    return order.indexOf(a.id) - order.indexOf(b.id);
  });

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
            ? "glass py-4 border-border" 
            : "bg-transparent py-8 border-transparent"
        }`}
      >
        <div className="container-custom flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-foreground text-gold-gradient cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            {restaurant.name.split(' ')[0]}<span className="text-muted-foreground">.</span>
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            {sortedCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleScrollTo(cat.id)}
                className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-colors duration-300"
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full cursor-pointer bg-card border border-border hover:bg-accent hover:text-accent-foreground transition-all duration-300"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button> 

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsBookModalOpen(true)}
              className="px-6 py-2 bg-card border border-border rounded-full text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-accent-foreground transition-all duration-300"
            >
              Book Table
            </motion.button>
          </div>
        </div>
      </nav>

      <HeroSection
        restaurantName={restaurant.name}
        tagline={restaurant.tagline}
        logo={restaurant.logo}
        heroImages={heroImages}
        onScrollDown={() => categories.length > 0 && handleScrollTo(categories[0].id)}
        onStoryClick={() => handleScrollTo("our-story")}
      />

      <section id="our-story" className="relative z-10 mt-10 px-4 md:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto glass-morphism border border-border rounded-3xl p-10">
          <h2 className="text-3xl font-bold text-foreground mb-4">Our Story</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            At Lumière Dining, we craft each experience as a masterpiece. From curated seasonal ingredients to immersive plating, we make every moment memorable. Our digital menu is part of a seamless restaurant journey designed for modern tastes.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We are located in the heart of the city with panoramic views and intimate seating. Our aim is to match culinary theater with the comfort of home.
          </p>
        </div>
      </section>

      <div className="relative z-10">
        {sortedCategories.map((category) => (
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

      {isBookModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 dark:bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-morphism p-8 rounded-3xl border border-border">
            <button onClick={() => setIsBookModalOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">✕</button>
            <h3 className="text-3xl font-bold text-foreground mb-4">Book a Table</h3>
            <p className="text-muted-foreground mb-6">
              Get in touch and reserve your seat for an unforgettable dining experience.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-xl font-semibold text-foreground mb-2">Contact Details</h4>
                <p className="text-muted-foreground">Phone: +251 912 345 678</p>
                <p className="text-muted-foreground">Email: reservations@lumiere-dining.com</p>
                <p className="text-muted-foreground">Address: 22 Crescent Street, Addis Ababa, Ethiopia</p>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-foreground mb-2">Opening Hours</h4>
                <p className="text-muted-foreground">Mon - Fri: 11:00 AM - 11:00 PM</p>
                <p className="text-muted-foreground">Sat - Sun: 10:00 AM - 12:00 AM</p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-xl font-semibold text-foreground mb-3">Our Location</h4>
              <div className="relative h-72 rounded-2xl overflow-hidden border border-border shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.512729673805!2d38.74913947549946!3d8.980257793236525!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85083c3a97f7%3A0xa1edb24bc50a324a!2sAddis%20Ababa%2C%20Ethiopia!5e0!3m2!1sen!2sus!4v1700282551354!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Name" className="w-full rounded-xl p-3 bg-card border border-border text-foreground focus:outline-none focus:border-accent" />
              <input type="email" placeholder="Email" className="w-full rounded-xl p-3 bg-card border border-border text-foreground focus:outline-none focus:border-accent" />
              <input type="tel" placeholder="Phone" className="w-full rounded-xl p-3 bg-card border border-border text-foreground focus:outline-none focus:border-accent" />
              <input type="datetime-local" className="w-full rounded-xl p-3 bg-card border border-border text-foreground focus:outline-none focus:border-accent" />
            </div>

            <button className="mt-6 w-full rounded-xl bg-accent py-3 text-accent-foreground font-bold uppercase hover:bg-accent/90 transition-all">Request Reservation</button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 bg-card pt-24 pb-12 border-t border-border">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
            <div className="md:col-span-2">
              <h3 className="text-3xl font-bold text-foreground text-gold-gradient mb-8">
                {restaurant.name}
              </h3>
              <p className="text-muted-foreground text-lg font-light leading-relaxed max-w-md">
                We believe that food is an experience, and our digital menu is just the beginning of your journey with us. Every dish is a story of tradition, passion, and excellence.
              </p>
            </div>
            
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.4em] text-muted-foreground mb-8">Navigation</h4>
              <ul className="flex flex-col gap-4">
                {sortedCategories.map(cat => (
                  <li key={cat.id}>
                    <button 
                      onClick={() => handleScrollTo(cat.id)}
                      className="text-muted-foreground hover:text-accent transition-colors duration-300 text-sm"
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.4em] text-muted-foreground mb-8">Social</h4>
              <ul className="flex flex-col gap-4">
                <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors duration-300 text-sm">Instagram</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors duration-300 text-sm">Facebook</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors duration-300 text-sm">Twitter</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-border gap-8">
            <p className="text-muted-foreground text-xs tracking-widest uppercase">
              © {new Date().getFullYear()} {restaurant.name}. Crafted with Excellence.
            </p>
            <div className="flex gap-12 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
              <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
