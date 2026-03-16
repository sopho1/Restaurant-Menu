import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await hash("admin123", 10)

  // Create an admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@restaurant.com" },
    update: {},
    create: {
      email: "admin@restaurant.com",
      password: hashedPassword,
    },
  })

  // Create example categories
  const category1 = await prisma.category.upsert({
    where: { name: "Starters" },
    update: {},
    create: { name: "Starters" },
  })

  const category2 = await prisma.category.upsert({
    where: { name: "Main Course" },
    update: {},
    create: { name: "Main Course" },
  })

  const category3 = await prisma.category.upsert({
    where: { name: "Desserts" },
    update: {},
    create: { name: "Desserts" },
  })

  const category4 = await prisma.category.upsert({
    where: { name: "Drinks" },
    update: {},
    create: { name: "Drinks" },
  })

  // Create example menu item
  await prisma.menuItem.create({
    data: {
      name: "Truffle Fries",
      description: "Crispy fries tossed in white truffle oil and parmesan cheese",
      price: 12.99,
      category: { connect: { id: category1.id } },
      isHot: true,
      image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=1887&auto=format&fit=crop",
    },
  })

  await prisma.menuItem.create({
    data: {
      name: "Wagyu Beef Burger",
      description: "Premium wagyu beef patty with caramelized onions, swiss cheese, and special house sauce on a brioche bun.",
      price: 24.50,
      category: { connect: { id: category2.id } },
      isHot: true,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899&auto=format&fit=crop",
    },
  })

  await prisma.menuItem.create({
    data: {
      name: "Chocolate Lava Cake",
      description: "Warm chocolate cake with a molten chocolate center, served with vanilla bean ice cream.",
      price: 14.00,
      category: { connect: { id: category3.id } },
      isHot: false,
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1887&auto=format&fit=crop",
    },
  })

  console.log("Database seeded successfully with Admin account!")
  console.log("Admin Email:", "admin@restaurant.com")
  console.log("Admin Password:", "admin123")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
