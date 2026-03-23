"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Menu as MenuIcon, 
  Tags, 
  LogOut, 
  ExternalLink, 
  Settings, 
  X, 
  ChevronLeft, 
  ChevronRight,
  QrCode
} from "lucide-react"
import { signOut } from "next-auth/react"
import { useTheme } from "next-themes"
import SessionTimeout from "./SessionTimeout"
import { cn } from "@/lib/utils"

export function AdminDashboardLayoutClient({
  children,
  userEmail,
}: {
  children: React.ReactNode
  userEmail: string
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  const menuItems = [
    { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Menu Items", href: "/admin/menu", icon: MenuIcon },
    { name: "Categories", href: "/admin/categories", icon: Tags },
    { name: "QR Codes", href: "/admin/qr", icon: QrCode },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <SessionTimeout />

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[50] lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-[60] glass border-r border-border flex flex-col transition-all duration-300 ease-in-out shadow-2xl lg:shadow-none",
        isSidebarOpen ? "w-72" : "w-20",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex h-20 items-center justify-between px-6">
          <Link href="/admin/dashboard" className={cn("flex items-center gap-3 transition-all", !isSidebarOpen && "justify-center w-full")}>
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-accent-foreground font-bold shadow-lg shadow-accent/20 flex-shrink-0">
              R
            </div>
            {isSidebarOpen && (
              <span className="font-bold text-xl tracking-tight text-foreground text-gold-gradient whitespace-nowrap">
                Admin<span className="text-muted-foreground">Panel</span>
              </span>
            )}
          </Link>
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1.5 mt-4 overflow-y-auto overflow-x-hidden">
          {isSidebarOpen && (
            <p className="px-4 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-4 mt-2">Core Management</p>
          )}
          
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3.5 transition-all duration-300 group relative",
                  isActive 
                    ? "bg-accent/10 text-accent font-semibold" 
                    : "text-muted-foreground hover:bg-accent/5 hover:text-foreground",
                  !isSidebarOpen && "justify-center"
                )}
              >
                <Icon size={20} className={cn("flex-shrink-0 transition-colors", isActive ? "text-accent" : "group-hover:text-accent")} />
                {isSidebarOpen && <span className="text-sm tracking-wide">{item.name}</span>}
                {!isSidebarOpen && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-black text-white dark:bg-white dark:text-black border border-white/10 dark:border-black/10 rounded-md text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            )
          })}

          {isSidebarOpen && (
            <p className="px-4 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-4 mt-8">External</p>
          )}
          <Link
            href="/"
            target="_blank"
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3.5 text-muted-foreground transition-all duration-300 hover:bg-accent/5 hover:text-foreground group",
              !isSidebarOpen && "justify-center"
            )}
          >
            <ExternalLink size={20} className="flex-shrink-0 group-hover:text-accent transition-colors" />
            {isSidebarOpen && <span className="text-sm tracking-wide">Public Site</span>}
          </Link>
        </nav>

        {/* Sidebar Toggle Button (Desktop Only) */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="hidden lg:flex absolute -right-3 top-24 w-6 h-6 bg-accent rounded-full items-center justify-center text-accent-foreground shadow-lg border border-border hover:scale-110 transition-transform z-[70]"
        >
          {isSidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>

        <div className="p-4 mt-auto border-t border-border">
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-rose-500 transition-all duration-300 hover:bg-rose-500/10 group",
              !isSidebarOpen && "justify-center"
            )}
          >
            <LogOut size={20} className="flex-shrink-0 group-hover:translate-x-1 transition-transform" />
            {isSidebarOpen && <span className="text-xs font-bold tracking-widest uppercase">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">
        {/* Top Header */}
        <header className="h-20 w-full glass border-b border-border px-6 lg:px-10 flex items-center justify-between flex-shrink-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden w-10 h-10 rounded-xl bg-card flex items-center justify-center text-muted-foreground hover:bg-accent/5 hover:text-foreground transition-colors"
            >
              <MenuIcon size={22} />
            </button>
            <h2 className="hidden sm:block text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Workspace</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-10 h-10 rounded-xl bg-card flex items-center justify-center hover:bg-accent/5 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <Link href="/admin/settings" className="w-10 h-10 rounded-xl bg-card flex items-center justify-center hover:bg-accent/5 transition-colors hidden sm:flex">
              <Settings size={18} />
            </Link>
            
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="flex flex-col items-end hidden md:flex">
                <span className="text-xs font-semibold text-foreground truncate max-w-[150px]">{userEmail}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">Administrator</span>
              </div>
              <details className="relative">
                <summary className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-accent-foreground font-bold cursor-pointer select-none shadow-lg shadow-accent/20">
                  {userEmail.charAt(0).toUpperCase()}
                </summary>
                <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-card border border-border shadow-2xl p-4 text-sm z-[100] backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center gap-3 mb-4 p-2 rounded-xl bg-accent/5">
                    <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-accent-foreground font-bold">{userEmail.charAt(0).toUpperCase()}</div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground truncate w-36">{userEmail}</span>
                      <span className="text-xs text-muted-foreground">Active Admin</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground hover:bg-accent/5 hover:text-foreground transition-colors">
                      <Settings size={16} />
                      Profile Settings
                    </Link>
                    <button 
                      onClick={() => signOut({ callbackUrl: "/admin/login" })}
                      className="flex w-full items-center gap-3 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
                    >
                      <LogOut size={16} />
                      Logout Session
                    </button>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-y-auto px-6 lg:px-10 py-8 lg:py-10 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
          <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
