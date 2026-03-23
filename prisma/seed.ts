import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@restaurant.com"
  const adminPlainPassword = process.env.ADMIN_PASSWORD || ""
  const hashedPassword = await hash(adminPlainPassword, 10)

  // Create an admin user
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword },
    create: {
      email: adminEmail,
      password: hashedPassword,
    },
  })

  console.log("Database seeded successfully with Admin account!")
  console.log("Admin Email:", adminEmail)
  console.log("Admin Password:", adminPlainPassword)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
