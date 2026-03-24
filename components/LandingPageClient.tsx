"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useSpring } from "framer-motion";
import { Phone, Mail, MapPin, Clock, X } from "lucide-react";
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
  const [mounted, setMounted] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isBookModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isBookModalOpen]);

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

  // Categories are already sorted by the server
  const sortedCategories = categories;

  return (
    <main className="relative min-h-screen bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-accent z-[100] origin-left"
        style={{ scaleX }}
      />

      {mounted && <TableBadge />}

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 border-b ${isScrolled
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

      <section id="our-story" className="relative z-10 -mt-20 px-4 md:px-8 lg:px-16 mb-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="glass-morphism border border-border rounded-[3rem] p-12 md:p-20 relative overflow-hidden group"
          >
            {/* Background Accent */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/5 rounded-full blur-[100px] transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/10 rounded-full blur-[100px] transition-transform duration-700 group-hover:scale-110" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 md:gap-16">
              <div className="flex-1 text-center md:text-left">
                <span className="text-accent font-bold uppercase tracking-[0.4em] text-[10px] block mb-6">Our Legacy</span>
                <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-8 text-luxury leading-tight">
                  Crafting Moments into <span className="text-gold-gradient">Masterpieces</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed text-lg font-light mb-8 max-w-xl">
                  At Lumière Dining, we believe every meal is a journey. From the flickering of a single candle to the intricate balance of flavors on your plate, we orchestrate an experience that transcends the ordinary.
                </p>
                <div className="flex flex-wrap items-center gap-8 justify-center md:justify-start">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-foreground">15+</span>
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">Years experience</span>
                  </div>
                  <div className="w-px h-12 bg-border hidden sm:block" />
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-foreground">24</span>
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">Master Chefs</span>
                  </div>
                  <div className="w-px h-12 bg-border hidden sm:block" />
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-foreground">5.0</span>
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">Michelin Dreams</span>
                  </div>
                </div>
              </div>
              <div className="flex-none hidden md:block w-1/3">
                <div className="aspect-[3/4] rounded-3xl overflow-hidden relative border border-border group-hover:border-accent/30 transition-colors duration-500">
                  <Image
                    src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80"
                    alt="Our Story"
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                </div>
              </div>
            </div>
          </motion.div>
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

      {mounted && isBookModalOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-white/5 backdrop-blur-3xl flex items-center justify-center p-4 transition-all"
          onClick={() => setIsBookModalOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto glass-morphism p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] border border-white/10 shadow-3xl custom-scrollbar"
          >
            {/* Elegant Close Button */}
            <button
              onClick={() => setIsBookModalOpen(false)}
              className="absolute top-6 right-6 md:top-8 md:right-8 w-10 md:w-12 h-10 md:h-12 rounded-full glass border border-white/10 flex items-center justify-center text-muted-foreground hover:text-accent hover:scale-110 transition-all z-[60]"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col lg:flex-row gap-12 md:gap-16 items-start mb-12">
              <div className="flex-1">
                <span className="text-accent font-bold uppercase tracking-[0.6em] text-[10px] mb-4 block">Exclusive Hospitality</span>
                <h3 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-luxury text-gold-gradient leading-tight lg:leading-none">
                  Reserve Your <span className="italic">Experience</span>
                </h3>
                <p className="text-muted-foreground text-lg font-light leading-relaxed max-w-xl border-l-2 border-accent/20 pl-6">
                  We believe dining is a sensory journey. Reserve your seat and let our concierge orchestrate your evening.
                </p>
              </div>

              <div className="w-full lg:w-[40%] grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: Phone, label: "Phone", value: "+251 912 345 678" },
                  { icon: Mail, label: "Email", value: "dining@lumiere.com" },
                  { icon: Clock, label: "Hours", value: "11:00 AM — 12:00 AM" },
                  { icon: MapPin, label: "Address", value: "22 Crescent St, Addis" },
                ].map((detail, i) => (
                  <div
                    key={i}
                    className="glass-morphism p-5 rounded-2xl border border-white/5 hover:border-accent/40 transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <detail.icon size={16} />
                    </div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-1">{detail.label}</h4>
                    <p className="text-sm font-bold text-foreground truncate">{detail.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative group mb-12">
              <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-gold-gradient/20 rounded-3xl blur opacity-20" />
              <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.512729673805!2d38.74913947549946!3d8.980257793236525!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85083c3a97f7%3A0xa1edb24bc50a324a!2sAddis%20Ababa%2C%20Ethiopia!5e0!3m2!1sen!2sus!4v1700282551354!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale invert brightness-90 group-hover:grayscale-0 group-hover:invert-0 group-hover:brightness-100 transition-all duration-[1.5s]"
                />
              </div>
            </div>
          </motion.div>
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
              © {mounted ? new Date().getFullYear() : "2024"} {restaurant.name}. Crafted with Excellence.
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
