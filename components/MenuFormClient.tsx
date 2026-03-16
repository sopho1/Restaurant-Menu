"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MenuItem, Category } from "@prisma/client"
import toast from "react-hot-toast"
import { Upload, ArrowLeft } from "lucide-react"

export function MenuFormClient({
  categories,
  initialData,
}: {
  categories: Category[]
  initialData?: MenuItem | null
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    categoryId: initialData?.categoryId || (categories.length > 0 ? categories[0].id : ""),
    image: initialData?.image || "",
    isHot: initialData?.isHot ?? false,
    isAvailable: initialData?.isAvailable ?? true,
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || "Upload failed")
      
      setFormData(prev => ({ ...prev, image: data.secure_url }))
      toast.success("Image uploaded")
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to upload image"
      toast.error(message)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const dataToSubmit = {
        ...formData,
        price: parseFloat(formData.price as string),
      }

      const url = initialData ? `/api/menu/${initialData.id}` : "/api/menu"
      const method = initialData ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSubmit),
      })

      if (!res.ok) throw new Error("Failed to save menu item")

      toast.success(initialData ? "Menu item updated" : "Menu item created")
      router.push("/admin/menu")
      router.refresh()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An error occurred"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-300 hover:text-gray-400 cursor-pointer transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Menu Items
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-8 w-full">
          {initialData ? "Edit Menu Item" : "Create New Menu Item"}
        </h1>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-4 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Item Image</label>
              <div className="relative flex items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition overflow-hidden">
                {formData.image ? (
                  <>
                    <img src={formData.image} alt="Preview" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                      <label className="cursor-pointer text-white font-medium bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">
                        Change Image
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                      </label>
                    </div>
                  </>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer text-gray-500">
                    {uploading ? (
                      <span>Uploading...</span>
                    ) : (
                      <>
                        <Upload size={32} className="mb-2 text-gray-400" />
                        <span className="font-medium text-sm">Click to upload image</span>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label className="block text-sm font-medium text-gray-700 text-left">Item Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                placeholder="Delicious Burger"
              />
            </div>

            <div className="space-y-2 text-left">
              <label className="block text-sm font-medium text-gray-700 text-left">Category</label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-4 md:col-span-2 text-left">
              <label className="block text-sm font-medium text-gray-700 text-left">Description</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white resize-none"
                placeholder="Describe the ingredients and preparation..."
              />
            </div>

            <div className="space-y-2 text-left">
              <label className="block text-sm font-medium text-gray-700 text-left">Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                placeholder="10.99"
              />
            </div>

            <div className="space-y-4 text-left flex flex-col justify-end">
              <label className="relative flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isHot}
                  onChange={(e) => setFormData({ ...formData, isHot: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-900">Mark as Popular/Hot</span>
              </label>

              <label className="relative flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-900">Available</span>
              </label>
            </div>
            
          </div>

          <div className="pt-6 border-t mt-8 text-center flex justify-center">
            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full md:w-auto px-8 rounded-xl bg-rose-600 py-3 text-white font-semibold hover:bg-rose-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Saving..." : initialData ? "Update Item" : "Create Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
