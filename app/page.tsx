import prisma from "@/lib/prisma"
import LandingPageClient from "@/components/LandingPageClient"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const [categories, hotItems] = await Promise.all([
    prisma.category.findMany({
      include: {
        menuItems: {
          orderBy: {
            createdAt: "desc",
          },
        },
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

  // Sorting function to match user's requested order
  const getCategoryOrder = (name: string): number => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("starter")) return 1;
    if (lowerName.includes("main")) return 2;
    if (lowerName.includes("dessert")) return 3;
    if (lowerName.includes("drink") || lowerName.includes("beverage")) return 4;
    return 5; // Everything else at the end
  };

  const sortedRawCategories = [...categories].sort((a, b) => 
    getCategoryOrder(a.name) - getCategoryOrder(b.name)
  );

  // Map Prisma data to the structure the client component expects
  const formattedCategories = sortedRawCategories.map((cat) => ({
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
