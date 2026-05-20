import { Skeleton } from '@/components/ui/skeleton'

export function DashboardSkeleton() {
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6" aria-busy="true" aria-label="Loading dashboard">
      <Skeleton className="h-10 w-64" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  )
}

export function StudySkeleton() {
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6" aria-busy="true" aria-label="Loading study session">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-2 w-full" />
      <Skeleton className="h-96 rounded-2xl" />
      <Skeleton className="h-14 w-full rounded-xl" />
    </div>
  )
}
