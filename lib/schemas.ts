import { z } from "zod"

export const CategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
})

export const MenuItemSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  price: z.coerce.number().positive("Price must be positive"),
  image: z.string().optional().nullable(),
  categoryId: z.string().min(1, "Category is required"),
  isHot: z.boolean().default(false),
  isAvailable: z.boolean().default(true),
})
