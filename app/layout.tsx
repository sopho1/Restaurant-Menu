import { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Toaster } from "react-hot-toast"
import { Providers } from "@/components/Providers"
import "./globals.css"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-luxury",
})

export const metadata: Metadata = {
  title: "Restaurant Menu | Luxury Experience",
  description: "Experience the finest culinary art with our modern digital menu.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <body className="bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
        <Providers>
          {children}
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 4000,
              className: "glass rounded-2xl text-foreground font-semibold px-6 py-4 shadow-2xl border-border",
              style: {
                background: "var(--glass-bg)",
                color: "var(--foreground)",
                backdropFilter: "blur(var(--glass-blur))",
              }
            }}
          />
        </Providers>
      </body>
    </html>
  )
}

