"use client"

import { useState } from "react"
import { Category } from "@prisma/client"
import { Plus, Trash2, Tags, Calendar } from "lucide-react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

export function CategoriesClient({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })

      if (!res.ok) throw new Error("Failed to create category")

      const newCategory = await res.json()
      setCategories([newCategory, ...categories])
      setName("")
      toast.success("New classification defined", {
        icon: '🏷️',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      })
      router.refresh()
    } catch (error) {
      toast.error("Failed to create category")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will remove all associated masterpieces in this category.")) return

    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete category")

      setCategories(categories.filter((c) => c.id !== id))
      toast.success("Classification removed")
      router.refresh()
    } catch (error) {
      toast.error("Failed to delete category")
    }
  }

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-luxury text-gold-gradient mb-2">Category Management</h1>
        <p className="text-foreground-muted font-light tracking-wide">Organize your culinary gallery into cohesive collections.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* Form Section */}
        <div className="xl:col-span-1">
          <div className="glass-morphism rounded-3xl p-8 sticky top-28">
            <h2 className="text-xl font-bold text-luxury mb-8">Define New Category</h2>
            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-3">Classification Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 px-5 text-sm focus:outline-none focus:border-accent/40 transition-all text-white"
                  placeholder="e.g. Signature Mains"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 rounded-2xl bg-accent py-4 px-6 text-accent-foreground font-bold hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] disabled:opacity-50 transition-all uppercase tracking-widest text-xs"
              >
                <Plus size={18} />
                {loading ? "Registering..." : "Add to Gallery"}
              </button>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="xl:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((category) => (
              <div key={category.id} className="glass-morphism rounded-3xl p-6 flex items-center justify-between group hover:bg-white/5 transition-all duration-500">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-accent">
                    <Tags size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-accent transition-colors">{category.name}</h3>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                      <Calendar size={12} />
                      {new Date(category.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(category.id)}
                  className="p-3 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-500/0 hover:shadow-rose-500/20 opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {categories.length === 0 && (
            <div className="py-24 glass-morphism rounded-3xl text-center">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 text-white/20">
                <Tags size={32} />
              </div>
              <p className="text-foreground-muted font-light">Your gallery has no classifications yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

