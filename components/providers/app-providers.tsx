'use client'

import { useEffect, type ReactNode } from 'react'
import { ThemeProvider } from '@/lib/theme-context'
import { useStudyStore } from '@/store/study-store'

function StudyHydration() {
  const hydrateFromSeed = useStudyStore((s) => s.hydrateFromSeed)
  const buildReviewQueue = useStudyStore((s) => s.buildReviewQueue)

  useEffect(() => {
    hydrateFromSeed()
    buildReviewQueue()
  }, [hydrateFromSeed, buildReviewQueue])

  return null
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <StudyHydration />
      {children}
    </ThemeProvider>
  )
}
