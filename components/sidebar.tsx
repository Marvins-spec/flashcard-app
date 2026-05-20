'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Home, BookOpen, BarChart3, Settings, Library, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', icon: Home, label: 'Dashboard' },
  { href: '/study', icon: BookOpen, label: 'Study' },
  { href: '/words', icon: Library, label: 'All Words' },
  { href: '/statistics', icon: BarChart3, label: 'Statistics' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-border bg-sidebar">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-sidebar-foreground">VocabMaster</h1>
            <p className="text-xs text-muted-foreground">Oxford 3000</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                    isActive
                      ? 'text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebarIndicator"
                      className="absolute inset-0 bg-sidebar-primary rounded-lg"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <item.icon className="h-5 w-5 relative z-10" />
                  <span className="font-medium relative z-10">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="rounded-xl bg-sidebar-accent p-4">
          <p className="text-sm font-medium text-sidebar-foreground mb-1">Daily Goal</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-sidebar-border rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full w-3/4" />
            </div>
            <span className="text-xs text-muted-foreground">15/20</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
