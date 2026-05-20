'use client'

/**
 * Backward-compatible study hook wrapping Zustand store.
 * Prefer useStudyStore from @/store/study-store in new code.
 */
import { useCallback } from 'react'
import { useStudyStore } from '@/store/study-store'
import type { VocabularyCard, ReviewRating, StudyMode, UserStats, StudyProgress } from '@/types'
import { loadAllVocabularyCards } from '@/data/load-vocabulary'

export function StudyProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function useStudy() {
  const state = useStudyStore()

  const getCurrentCard = useCallback((): VocabularyCard | null => {
    return state.currentCards[state.currentIndex] ?? null
  }, [state.currentCards, state.currentIndex])

  const getProgress = useCallback(() => {
    return {
      current: state.currentIndex + 1,
      total: state.currentCards.length,
    }
  }, [state.currentIndex, state.currentCards.length])

  return {
    currentCards: state.currentCards,
    currentIndex: state.currentIndex,
    isFlipped: state.isFlipped,
    studyMode: state.studyMode,
    userStats: state.userStats as UserStats,
    progress: new Map(Object.entries(state.progress)) as Map<string, StudyProgress>,
    isStudying: state.isStudying,
    flipCard: state.flipCard,
    nextCard: state.nextCard,
    previousCard: state.previousCard,
    rateCard: state.rateCard,
    setStudyMode: state.setStudyMode,
    startStudy: state.startStudy,
    endStudy: state.endStudy,
    getCurrentCard,
    getProgress,
    resetFlip: state.resetFlip,
  }
}

export const vocabularyData = loadAllVocabularyCards()
