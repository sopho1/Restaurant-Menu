import prisma from "@/lib/prisma"
import LandingPageClient from "@/components/LandingPageClient"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const [categories, hotItems] = await Promise.all([
    prisma.category.findMany({
      include: {
        menuItems: {
          where: {
            isAvailable: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    }),
    prisma.menuItem.findMany({
      where: {
        isAvailable: true,
        isHot: true,
        image: { not: null },
      },
      take: 5,
    }),
  ])

  // Map Prisma data to the structure the client component expects
  const formattedCategories = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    items: cat.menuItems.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      isHot: item.isHot,
      isAvailable: item.isAvailable,
      star: item.star,
    })),
  }))

  const heroImages = hotItems.map(item => item.image).filter(Boolean) as string[]

  const restaurant = {
    name: "LUMIÈRE DINING",
    tagline: "A Culinary Journey Through Light and Shadow",
    logo: "/logo.jpg",
  }

  return (
    <LandingPageClient 
      restaurant={restaurant} 
      categories={formattedCategories} 
      heroImages={heroImages.length > 0 ? heroImages : undefined}
    />
  )
}
