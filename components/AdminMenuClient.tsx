"use client"

import { useState } from "react"
import { MenuItem, Category } from "@prisma/client"
import { Plus, Edit2, Trash2, Flame, CheckCircle, XCircle, MoreVertical, Search, Filter } from "lucide-react"
import Link from "next/link"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import Image from "next/image"

type ItemWithCategory = MenuItem & { category: Category }

export function AdminMenuClient({ initialItems }: { initialItems: ItemWithCategory[] }) {
  const [items, setItems] = useState(initialItems)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this exquisite item?")) return

    try {
      const res = await fetch(`/api/menu/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")

      setItems(items.filter((i) => i.id !== id))
      toast.success("Item removed from gallery", {
        icon: '🗑️',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      })
      router.refresh()
    } catch (error) {
      toast.error("An error occurred while deleting")
    }
  }

  const toggleStatus = async (id: string, field: "isHot" | "isAvailable", currentValue: boolean) => {
    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !currentValue }),
      })

      if (!res.ok) throw new Error("Failed to update status")

      const updatedItem = await res.json()
      setItems(items.map((i) => (i.id === id ? { ...i, ...updatedItem } : i)))
      toast.success(`${field} state refined`)
      router.refresh()
    } catch (error) {
      toast.error(`Precision error: Failed to update status`)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-luxury text-gold-gradient mb-2">Menu Inventory</h1>
          <p className="text-foreground-muted font-light tracking-wide">Manage your digital culinary showcase.</p>
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
            className="flex items-center gap-2 rounded-2xl bg-accent px-6 py-3 text-accent-foreground font-bold text-sm hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all whitespace-nowrap"
          >
            <Plus size={18} /> Add Selection
          </Link>
        </div>
      </div>

      {/* Grid List View (Replacing Table for more modern feel) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="glass-morphism rounded-3xl p-6 flex flex-col sm:flex-row gap-6 group hover:bg-white/5 transition-all duration-500">
            <div className="relative w-full sm:w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0">
              {item.image ? (
                <Image className="object-cover group-hover:scale-110 transition-transform duration-700" src={item.image} alt={item.name} fill />
              ) : (
                <div className="w-full h-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/20 uppercase tracking-widest">No Plate</div>
              )}
              {item.isHot && (
                <div className="absolute top-2 right-2 bg-accent p-1.5 rounded-full shadow-lg">
                  <Flame size={12} fill="currentColor" className="text-accent-foreground" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-accent transition-colors">{item.name}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-white/5 text-white/40 border border-white/5">
                    {item.category.name}
                  </span>
                </div>
                <div className="text-xl font-bold text-accent">
                  ETB {item.price}
                </div>
              </div>
              <p className="text-foreground-muted text-sm line-clamp-1 mb-6 font-light">
                {item.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleStatus(item.id, "isAvailable", item.isAvailable)}
                    className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${item.isAvailable ? "text-emerald-400" : "text-white/20"}`}
                  >
                    {item.isAvailable ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    {item.isAvailable ? "Active" : "Archived"}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/menu/${item.id}/edit`}
                    className="p-2.5 rounded-xl bg-white/5 text-white/40 hover:bg-white/10 hover:text-white transition-all"
                  >
                    <Edit2 size={16} />
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-500/0 hover:shadow-rose-500/20"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-full py-24 glass-morphism rounded-3xl text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 text-white/20">
              <Plus size={32} />
            </div>
            <p className="text-foreground-muted font-light">No items matching your refinement.</p>
          </div>
        )}
      </div>
    </div>
  )
}

