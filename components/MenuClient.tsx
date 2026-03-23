"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, UtensilsCrossed, Settings, Info } from "lucide-react"
import { MenuItemCard } from "./MenuItemCard"
import { Category } from "@prisma/client"
import Image from "next/image"

export function MenuClient({
  initialItems,
  categories,
}: {
  initialItems: any[]
  categories: Category[]
}) {
  const [activeCategory, setActiveCategory] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredItems = initialItems.filter((item) => {
    const matchesCategory =
      activeCategory === "All" ||
      item.category?.name === activeCategory

    const query = searchQuery.toLowerCase()
    const matchesSearch =
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)

    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
      
      {/* Immersive Header */}
      <header className="relative h-[50vh] min-h-[400px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 scale-105 animate-float">
          <Image 
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop" 
            alt="Fine dining atmosphere"
            fill
            className="object-cover brightness-[0.3] contrast-125"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-background z-10" />
        
        <div className="relative z-20 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-accent mb-4 block">Exquisite Selections</span>
            <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-luxury text-gold-gradient mb-6">
              The Gallery
            </h1>
            <div className="w-24 h-1 bg-accent mx-auto rounded-full mb-8" />
            <p className="text-muted-foreground max-w-xl mx-auto text-lg font-light tracking-wide">
              Curated flavors and meticulously crafted masterpieces for the discerning palate.
            </p>
          </motion.div>
        </div>
      </header>

      <main className="container-custom -mt-24 relative z-30 pb-32">
        
        {/* Controls Section */}
        <div className="glass-morphism rounded-[2.5rem] p-6 mb-16 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10">
          
          {/* Categories Horizontal Scroll */}
          <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto pb-4 md:pb-0 no-scrollbar">
            <button
              onClick={() => setActiveCategory("All")}
              className={`rounded-2xl px-8 py-3.5 text-xs font-bold uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${
                activeCategory === "All"
                  ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20"
                  : "bg-card text-muted-foreground/60 hover:bg-card-hover hover:text-foreground border border-border"
              }`}
            >
              All Library
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`rounded-2xl px-8 py-3.5 text-xs font-bold uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${
                  activeCategory === cat.name
                    ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20"
                    : "bg-card text-muted-foreground/60 hover:bg-card-hover hover:text-foreground border border-border"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Luxury Search */}
          <div className="relative w-full md:w-80 group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-6 transition-colors duration-300 group-focus-within:text-accent text-muted-foreground/30">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder="Refine your selection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-2xl bg-card border border-border py-4 pl-14 pr-6 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-accent/40 focus:bg-card/40 transition-all font-light tracking-wide text-sm"
            />
          </div>
        </div>

        {/* Dynamic Grid */}
        <motion.div 
          layout 
          className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <MenuItemCard key={item.id} item={item} index={index % 4} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-24 h-24 rounded-full bg-card border border-border flex items-center justify-center mb-8 animate-float">
              <UtensilsCrossed size={40} className="text-muted-foreground/20" />
            </div>
            <h3 className="text-2xl font-bold text-luxury mb-4">No Masterpieces Found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto font-light">
              Our culinary curators couldn't find any results for "{searchQuery}". Try refining your search or category.
            </p>
          </motion.div>
        )}
      </main>

      {/* Quick Access Floating UI (Optional premium touch) */}
      <div className="fixed bottom-10 right-10 z-[100] flex flex-col gap-4">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 rounded-full glass flex items-center justify-center text-accent shadow-2xl border border-border"
          >
            <Info size={24} />
          </motion.button>
      </div>
    </div>
  )
}
