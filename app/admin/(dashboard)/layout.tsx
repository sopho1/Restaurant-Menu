import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Menu, Tags, LogOut, ExternalLink, Settings } from "lucide-react"
import { signOut } from "@/lib/auth"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect("/admin/login")
  }

  return (
    <div className="flex h-screen bg-[#050505] text-white">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 bg-black/40 backdrop-blur-2xl flex flex-col transition-all duration-300">
        <div className="flex h-24 items-center px-8">
          <Link href="/" className="group flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-accent-foreground font-bold shadow-lg shadow-accent/20 transition-transform group-hover:scale-110">
              R
            </div>
            <span className="font-bold text-xl tracking-tight text-luxury text-gold-gradient">
              Admin<span className="text-white">Panel</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <p className="px-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mb-4">Core Management</p>
          
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-foreground-muted transition-all duration-300 hover:bg-white/5 hover:text-white group"
          >
            <LayoutDashboard size={18} className="group-hover:text-accent transition-colors" />
            <span className="text-sm font-medium tracking-wide">Overview</span>
          </Link>
          
          <Link
            href="/admin/menu"
            className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-foreground-muted transition-all duration-300 hover:bg-white/5 hover:text-white group"
          >
            <Menu size={18} className="group-hover:text-accent transition-colors" />
            <span className="text-sm font-medium tracking-wide">Menu Items</span>
          </Link>
          
          <Link
            href="/admin/categories"
            className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-foreground-muted transition-all duration-300 hover:bg-white/5 hover:text-white group"
          >
            <Tags size={18} className="group-hover:text-accent transition-colors" />
            <span className="text-sm font-medium tracking-wide">Categories</span>
          </Link>

          <Link
            href="/admin/qr"
            className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-foreground-muted transition-all duration-300 hover:bg-white/5 hover:text-white group"
          >
            <Settings size={18} className="group-hover:text-accent transition-colors" />
            <span className="text-sm font-medium tracking-wide">QR Codes</span>
          </Link>

          <p className="px-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mb-4 mt-8">External</p>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-foreground-muted transition-all duration-300 hover:bg-white/5 hover:text-white group"
          >
            <ExternalLink size={18} className="group-hover:text-accent transition-colors" />
            <span className="text-sm font-medium tracking-wide">View Public Site</span>
          </Link>
        </nav>

        <div className="p-4 mt-auto border-t border-white/5">
          <form
            action={async () => {
              "use server"
              await signOut()
            }}
          >
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-rose-500 transition-all duration-300 hover:bg-rose-500/10 hover:shadow-lg hover:shadow-rose-500/5 group"
            >
              <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
              <span className="text-sm font-bold tracking-widest uppercase">Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full relative">
        {/* Top Header Placeholder / Blur Guard */}
        <div className="sticky top-0 z-40 h-24 w-full glass border-b border-white/5 px-12 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-white/40">Workspace</h2>
          </div>
          <div className="flex items-center gap-6">
            <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
              <Settings size={18} />
            </button>
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold">
              A
            </div>
          </div>
        </div>
        
        {/* Page Content */}
        <div className="p-12 animate-in fade-in duration-700">
          {children}
        </div>
      </main>
    </div>
  )
}

