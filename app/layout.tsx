import { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Toaster } from "react-hot-toast"
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
        {children}
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: "rgba(255, 255, 255, 0.05)",
              color: "#fff",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "1rem",
            }
          }}
        />
      </body>
    </html>
  )
}

