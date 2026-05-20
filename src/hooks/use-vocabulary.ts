'use client'

import { useEffect, useMemo } from 'react'
import { useStudyStore } from '@/store/study-store'
import { filterDueCards } from '@/utils/vocabulary'

export function useVocabularyInit() {
  const hydrateFromSeed = useStudyStore((s) => s.hydrateFromSeed)
  const buildReviewQueue = useStudyStore((s) => s.buildReviewQueue)
  const hydrated = useStudyStore((s) => s.hydrated)
  const isLoading = useStudyStore((s) => s.isLoading)

  useEffect(() => {
    hydrateFromSeed()
    buildReviewQueue()
  }, [hydrateFromSeed, buildReviewQueue])

  return { hydrated, isLoading }
}

export function useDueCards() {
  const vocabulary = useStudyStore((s) => s.vocabulary)
  return useMemo(() => filterDueCards(vocabulary), [vocabulary])
}

export function useWeakWords() {
  const vocabulary = useStudyStore((s) => s.vocabulary)
  const weakWordIds = useStudyStore((s) => s.weakWordIds)
  return useMemo(
    () => vocabulary.filter((v) => weakWordIds.includes(v.id)),
    [vocabulary, weakWordIds]
  )
}
