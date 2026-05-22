'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  ReviewRating,
  StudyMode,
  UserStats,
  VocabularyCard,
  VocabularyWithProgress,
  StudyProgress,
} from '@/types'
import { applySM2Rating, isCorrectRating } from '@/lib/spacedRepetition'
import {
  bumpHeatmap,
  createDefaultUserStats,
  updateStreak,
  calculateAccuracy,
  computeRetentionByLevel,
  computeRetentionRate,
  type RetentionLevelStat,
} from '@/utils/statistics'
import {
  filterDueCards,
  shuffleCards,
  cardToWithProgress,
  isWordLearned,
  mergeVocabularyWithSeed,
} from '@/utils/vocabulary'
import { toDateKey } from '@/utils/date'
import { loadAllVocabularyCards } from '@/data/load-vocabulary'

interface StudyStoreState {
  vocabulary: VocabularyWithProgress[]
  reviewQueue: string[]
  learnedWordIds: string[]
  weakWordIds: string[]
  currentCards: VocabularyCard[]
  currentIndex: number
  isFlipped: boolean
  studyMode: StudyMode
  isStudying: boolean
  progress: Record<string, StudyProgress>
  userStats: UserStats
  settings: {
    dailyGoal: number
    audioEnabled: boolean
  }
  hydrated: boolean
  isLoading: boolean

  hydrateFromSeed: () => void
  setVocabulary: (cards: VocabularyWithProgress[]) => void
  buildReviewQueue: () => void
  flipCard: () => void
  resetFlip: () => void
  nextCard: () => void
  previousCard: () => void
  rateCard: (rating: ReviewRating) => void
  setStudyMode: (mode: StudyMode) => void
  startStudy: (cards?: VocabularyCard[]) => void
  endStudy: () => void
  getCurrentCard: () => VocabularyCard | null
  getProgress: () => { current: number; total: number }
  getDueCards: () => VocabularyWithProgress[]
  getWeakWords: () => VocabularyWithProgress[]
  getLearnedWords: () => VocabularyWithProgress[]
  getRetentionRate: () => number
  getRetentionByLevel: () => RetentionLevelStat[]
  setDailyGoal: (goal: number) => void
  setLoading: (loading: boolean) => void
}

const seedVocabulary: VocabularyWithProgress[] = loadAllVocabularyCards().map((c) =>
  cardToWithProgress(c)
)

function syncQueues(state: StudyStoreState): Pick<StudyStoreState, 'reviewQueue' | 'weakWordIds' | 'learnedWordIds'> {
  const due = filterDueCards(state.vocabulary)
  const weak = state.vocabulary.filter(
    (c) => c.easeFactor < 2.0 || (c.reviewCount > 0 && c.interval <= 1)
  )
  const learned = state.vocabulary.filter(isWordLearned)
  return {
    reviewQueue: due.map((c) => c.id),
    weakWordIds: weak.map((c) => c.id),
    learnedWordIds: learned.map((c) => c.id),
  }
}

function applyVocabularySync(
  state: StudyStoreState,
  vocabulary: VocabularyWithProgress[]
): Partial<StudyStoreState> {
  const queues = syncQueues({ ...state, vocabulary })
  const mastered = vocabulary.filter(isWordLearned).length
  return {
    vocabulary,
    ...queues,
    userStats: { ...state.userStats, totalWordsLearned: mastered },
  }
}

export const useStudyStore = create<StudyStoreState>()(
  persist(
    (set, get) => ({
      vocabulary: seedVocabulary,
      reviewQueue: [],
      learnedWordIds: [],
      weakWordIds: [],
      currentCards: [],
      currentIndex: 0,
      isFlipped: false,
      studyMode: 'flip',
      isStudying: false,
      progress: {},
      userStats: createDefaultUserStats(20),
      settings: { dailyGoal: 20, audioEnabled: true },
      hydrated: false,
      isLoading: false,

      hydrateFromSeed: () => {
        const state = get()
        const vocabulary = mergeVocabularyWithSeed(state.vocabulary, seedVocabulary)
        set({ ...applyVocabularySync(state, vocabulary), hydrated: true })
      },

      setVocabulary: (cards) => {
        set((state) => applyVocabularySync(state, cards))
      },

      buildReviewQueue: () => {
        set((state) => syncQueues(state))
      },

      flipCard: () => set((s) => ({ isFlipped: !s.isFlipped })),

      resetFlip: () => set({ isFlipped: false }),

      nextCard: () =>
        set((s) => {
          if (s.currentIndex < s.currentCards.length - 1) {
            return { currentIndex: s.currentIndex + 1, isFlipped: false }
          }
          return { isStudying: false }
        }),

      previousCard: () =>
        set((s) =>
          s.currentIndex > 0
            ? { currentIndex: s.currentIndex - 1, isFlipped: false }
            : s
        ),

      rateCard: (rating) => {
        const state = get()
        const card = state.currentCards[state.currentIndex]
        if (!card) return

        const vocabCard = state.vocabulary.find((v) => v.id === card.id) ?? cardToWithProgress(card)
        const sm2 = applySM2Rating(
          {
            easeFactor: vocabCard.easeFactor,
            interval: vocabCard.interval,
            repetitions: vocabCard.reviewCount,
            lastReviewed: vocabCard.lastReviewed ? new Date(vocabCard.lastReviewed) : null,
          },
          rating
        )

        const updatedVocab = state.vocabulary.map((v) =>
          v.id === card.id
            ? {
                ...v,
                easeFactor: sm2.easeFactor,
                interval: sm2.interval,
                reviewCount: sm2.repetitions,
                nextReview: sm2.nextReview.toISOString(),
                lastReviewed: sm2.lastReviewed.toISOString(),
              }
            : v
        )

        const streakUpdate = updateStreak(
          state.userStats.streak,
          state.userStats.longestStreak,
          state.userStats.lastStudyDate
        )

        const today = toDateKey()
        const resetToday = state.userStats.lastStudyDate !== today

        const newStats = {
          ...state.userStats,
          totalReviews: state.userStats.totalReviews + 1,
          todayReviews: resetToday ? 1 : state.userStats.todayReviews + 1,
          correctAnswers: isCorrectRating(rating)
            ? state.userStats.correctAnswers + 1
            : state.userStats.correctAnswers,
          totalWordsLearned: updatedVocab.filter(isWordLearned).length,
          streak: streakUpdate.streak,
          longestStreak: streakUpdate.longestStreak,
          lastStudyDate: streakUpdate.lastStudyDate,
          monthlyHeatmap: bumpHeatmap(state.userStats.monthlyHeatmap),
        }

        const hasMore = state.currentIndex < state.currentCards.length - 1
        const nextState = {
          vocabulary: updatedVocab,
          userStats: newStats,
          currentIndex: hasMore ? state.currentIndex + 1 : state.currentIndex,
          isFlipped: false,
          isStudying: hasMore,
        }

        set({ ...nextState, ...syncQueues({ ...state, ...nextState }) })
      },

      setStudyMode: (mode) => set({ studyMode: mode }),

      startStudy: (cards) => {
        const state = get()
        const dueIds = new Set(state.reviewQueue)
        const queue =
          cards ??
          state.vocabulary
            .filter((v) => dueIds.has(v.id))
            .slice(0, 20)
            .map(({ id, word, ipa, thaiMeaning, thaiReading, type, level, example, exampleThai, synonyms, tags, audioUrl }) => ({
              id,
              word,
              ipa,
              thaiMeaning,
              thaiReading,
              type,
              level,
              example,
              exampleThai,
              synonyms,
              tags,
              audioUrl,
            }))

        const studyCards =
          queue.length > 0 ? queue : shuffleCards(state.vocabulary).slice(0, 10)

        set({
          currentCards: studyCards as VocabularyCard[],
          currentIndex: 0,
          isFlipped: false,
          isStudying: true,
        })
      },

      endStudy: () =>
        set({ isStudying: false, currentIndex: 0, isFlipped: false }),

      getCurrentCard: () => {
        const s = get()
        return s.currentCards[s.currentIndex] ?? null
      },

      getProgress: () => {
        const s = get()
        return { current: s.currentIndex + 1, total: s.currentCards.length }
      },

      getDueCards: () => filterDueCards(get().vocabulary),

      getWeakWords: () =>
        get().vocabulary.filter((v) => get().weakWordIds.includes(v.id)),

      getLearnedWords: () =>
        get().vocabulary.filter((v) => get().learnedWordIds.includes(v.id)),

      getRetentionRate: () => computeRetentionRate(get().vocabulary),

      getRetentionByLevel: () => computeRetentionByLevel(get().vocabulary),

      setDailyGoal: (goal) =>
        set((s) => ({
          settings: { ...s.settings, dailyGoal: goal },
          userStats: { ...s.userStats, dailyGoal: goal },
        })),

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'vocabmaster-study',
      partialize: (state) => ({
        vocabulary: state.vocabulary,
        progress: state.progress,
        userStats: state.userStats,
        settings: state.settings,
        learnedWordIds: state.learnedWordIds,
        weakWordIds: state.weakWordIds,
        reviewQueue: state.reviewQueue,
      }),
      onRehydrateStorage: () => (state) => {
        state?.hydrateFromSeed()
      },
    }
  )
)

export function useStudyStats() {
  const userStats = useStudyStore((s) => s.userStats)
  return {
    userStats,
    accuracy: calculateAccuracy(userStats.totalReviews, userStats.correctAnswers),
  }
}
