"use client"

import { useState } from "react"
import { MenuItem, Category } from "@prisma/client"
import { Plus, Edit2, Trash2, Flame, CheckCircle, XCircle, Search, AlertTriangle } from "lucide-react"
import Link from "next/link"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

type ItemWithCategory = MenuItem & { category: Category }

export function AdminMenuClient({ initialItems }: { initialItems: ItemWithCategory[] }) {
  const [items, setItems] = useState(initialItems)
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const router = useRouter()

  const itemToDelete = items.find(i => i.id === deleteId)

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const confirmDelete = async () => {
    if (!deleteId) return

    try {
      const res = await fetch(`/api/menu/${deleteId}`, { method: "DELETE" })

      if (!res.ok) throw new Error("Failed")

      setItems(items.filter(i => i.id !== deleteId))

      toast.success("Item removed from gallery", { icon: "🗑️" })

      setDeleteId(null)

      router.refresh()

    } catch {
      toast.error("An error occurred while deleting")
    }
  }

  const toggleStatus = async (id: string, field: "isHot" | "isAvailable", currentValue: boolean) => {
    const existingItem = items.find(i => i.id === id)
    if (!existingItem) {
      toast.error("Item not found")
      return
    }

    const payload = {
      name: existingItem.name,
      description: existingItem.description,
      price: existingItem.price,
      image: existingItem.image,
      categoryId: existingItem.categoryId,
      isHot: field === "isHot" ? !currentValue : existingItem.isHot,
      isAvailable: field === "isAvailable" ? !currentValue : existingItem.isAvailable,
    }

    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error()

      const updatedItem = await res.json()

      setItems(items.map(i => (i.id === id ? { ...i, ...updatedItem } : i)))

      toast.success(`${field} state refined`)

      router.refresh()

    } catch {
      toast.error("Failed to update status")
    }
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gold-gradient mb-2">Menu Inventory</h1>
          <p className="text-foreground-muted font-light tracking-wide">
            Manage your digital culinary showcase.
          </p>
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">

          <div className="relative flex-1 lg:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-accent/40 transition-all"
            />
          </div>

          <Link
            href="/admin/menu/new"
            className="flex items-center gap-2 rounded-2xl bg-accent px-6 py-3 text-accent-foreground font-bold text-sm hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all"
          >
            <Plus size={18} /> Add Selection
          </Link>

        </div>
      </div>

      {/* Items Grid */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {filteredItems.map((item) => (

          <div key={item.id} className="glass-morphism rounded-3xl p-6 flex gap-6 group hover:bg-white/5 transition-all">

            <div className="relative w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full bg-white/5 flex items-center justify-center text-[10px] text-white/20">
                  No Plate
                </div>
              )}

              {item.isHot && (
                <div className="absolute top-2 right-2 bg-accent p-1.5 rounded-full">
                  <Flame size={12} fill="currentColor" />
                </div>
              )}
            </div>

            <div className="flex-1">

              <div className="flex justify-between mb-2">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-accent">
                    {item.name}
                  </h3>

                  <span className="text-[10px] uppercase tracking-widest text-white/40">
                    {item.category.name}
                  </span>
                </div>

                <div className="text-xl font-bold text-accent">
                  ETB {item.price}
                </div>
              </div>

              <p className="text-foreground-muted text-sm line-clamp-1 mb-6">
                {item.description}
              </p>

              <div className="flex justify-between">

                <button
                  onClick={() => toggleStatus(item.id, "isAvailable", item.isAvailable)}
                  className={`flex items-center gap-2 text-xs ${
                    item.isAvailable ? "text-emerald-400" : "text-white/30"
                  }`}
                >
                  {item.isAvailable ? <CheckCircle size={14}/> : <XCircle size={14}/>}
                  {item.isAvailable ? "Active" : "Archived"}
                </button>

                <div className="flex gap-2">

                  <Link
                    href={`/admin/menu/${item.id}/edit`}
                    className="p-2.5 rounded-xl bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
                  >
                    <Edit2 size={16}/>
                  </Link>

                  <button
                    onClick={() => setDeleteId(item.id)}
                    className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white"
                  >
                    <Trash2 size={16}/>
                  </button>

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* DELETE MODAL */}

      <AnimatePresence>

        {deleteId && (

          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >

            <motion.div
              className="glass-morphism rounded-3xl p-10 max-w-md w-full text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >

              <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mb-6">
                <AlertTriangle size={28}/>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                Delete Menu Item
              </h3>

              <p className="text-white/60 text-sm mb-8">
                Are you sure you want to delete
                <span className="text-accent font-semibold"> {itemToDelete?.name}</span>?
              </p>

              <div className="flex gap-4 justify-center">

                <button
                  onClick={() => setDeleteId(null)}
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDelete}
                  className="px-6 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold"
                >
                  Delete
                </button>

              </div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  )
}