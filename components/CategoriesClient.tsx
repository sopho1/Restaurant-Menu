"use client"

import { useState } from "react"
import { Category } from "@prisma/client"
import { Plus, Trash2, Tags, Calendar, AlertTriangle } from "lucide-react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export function CategoriesClient({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const router = useRouter()

  const categoryToDelete = categories.find(c => c.id === deleteId)

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
        icon: "🏷️",
      })

      router.refresh()

    } catch {
      toast.error("Failed to create category")
    } finally {
      setLoading(false)
    }
  }

  const confirmDelete = async () => {
    if (!deleteId) return

    try {
      const res = await fetch(`/api/categories/${deleteId}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed")

      setCategories(categories.filter(c => c.id !== deleteId))

      toast.success("Classification removed")

      setDeleteId(null)

      router.refresh()

    } catch {
      toast.error("Failed to delete category")
    }
  }

  return (
    <div className="space-y-12">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-luxury text-gold-gradient mb-2">
          Category Management
        </h1>
        <p className="text-muted-foreground font-light tracking-wide">
          Organize your culinary gallery into cohesive collections.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">

        {/* Form */}
        <div className="xl:col-span-1">
          <div className="glass-morphism rounded-3xl p-8 sticky top-28">

            <h2 className="text-xl font-bold text-luxury mb-8">
              Define New Category
            </h2>

            <form onSubmit={handleCreate} className="space-y-6">

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-3">
                  Classification Name
                </label>

                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-card border border-border rounded-2xl py-3.5 px-5 text-sm focus:outline-none focus:border-accent/40 transition-all text-foreground"
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

        {/* Categories List */}
        <div className="xl:col-span-2 space-y-4">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {categories.map((category) => (

              <div
                key={category.id}
                className="glass-morphism rounded-3xl p-6 flex items-center justify-between group hover:bg-card/40 transition-all duration-500"
              >

                <div className="flex items-center gap-5">

                  <div className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center text-accent">
                    <Tags size={20} />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-accent transition-colors">
                      {category.name}
                    </h3>

                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                      <Calendar size={12} />
                      {new Date(category.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                </div>

                <button
                  onClick={() => setDeleteId(category.id)}
                  className="p-3 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>

              </div>

            ))}

          </div>

        </div>

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
                <AlertTriangle size={28} />
              </div>

              <h3 className="text-xl font-bold text-foreground mb-2">
                Delete Category
              </h3>

              <p className="text-muted-foreground text-sm mb-8">
                Are you sure you want to delete{" "}
                <span className="text-accent font-semibold">
                  {categoryToDelete?.name}
                </span>
                ?  
                This action cannot be undone.
              </p>

              <div className="flex gap-4 justify-center">

                <button
                  onClick={() => setDeleteId(null)}
                  className="px-6 py-3 rounded-xl bg-card border border-border hover:bg-card-hover text-foreground text-sm flex-1 transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDelete}
                  className="px-6 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold flex-1 transition-colors"
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
