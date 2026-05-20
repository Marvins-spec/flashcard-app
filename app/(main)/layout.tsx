import { AppProviders } from '@/components/providers/app-providers'
import { Sidebar } from '@/components/sidebar'
import { BottomNav } from '@/components/bottom-nav'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppProviders>
      <Sidebar />
      <main className="min-h-screen bg-background">{children}</main>
      <BottomNav />
    </AppProviders>
  )
}
