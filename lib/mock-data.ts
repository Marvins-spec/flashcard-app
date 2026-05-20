import type { VocabularyCard, UserStats, WeeklyData, HeatmapData } from '@/types'
import { loadAllVocabularyCards } from '@/data/load-vocabulary'
import { generateEmptyHeatmap, generateEmptyWeeklyData, createDefaultUserStats } from '@/utils/statistics'
import { filterDueCards, cardToWithProgress } from '@/utils/vocabulary'

export const vocabularyData = loadAllVocabularyCards()

export const generateWeeklyData = (): WeeklyData[] => generateEmptyWeeklyData()

export const generateHeatmapData = (): HeatmapData[] => generateEmptyHeatmap()

export const mockUserStats: UserStats = {
  ...createDefaultUserStats(20),
  totalWordsLearned: 12,
  totalReviews: 248,
  correctAnswers: 210,
  streak: 5,
  longestStreak: 12,
  lastStudyDate: new Date().toISOString().split('T')[0],
  todayReviews: 8,
  weeklyData: [
    { day: 'Mon', reviews: 18, correct: 15 },
    { day: 'Tue', reviews: 22, correct: 19 },
    { day: 'Wed', reviews: 12, correct: 10 },
    { day: 'Thu', reviews: 25, correct: 21 },
    { day: 'Fri', reviews: 20, correct: 17 },
    { day: 'Sat', reviews: 8, correct: 7 },
    { day: 'Sun', reviews: 15, correct: 13 },
  ],
  monthlyHeatmap: generateHeatmapData().map((d, i) => ({
    ...d,
    count: i % 3 === 0 ? Math.floor(Math.random() * 25) + 1 : i % 5 === 0 ? 0 : Math.floor(Math.random() * 15),
  })),
}

const withProgress = vocabularyData.map((c) => cardToWithProgress(c))

export const weakWords = withProgress
  .filter((c) => c.easeFactor < 2.2 || c.reviewCount > 0 && c.interval <= 1)
  .slice(0, 5)
  .map(({ id, word, ipa, thaiMeaning, thaiReading, type, level, example, exampleThai, synonyms, tags, audioUrl }) => ({
    id, word, ipa, thaiMeaning, thaiReading, type, level, example, exampleThai, synonyms, tags, audioUrl,
  }))

export const dueCards = filterDueCards(withProgress)
  .slice(0, 10)
  .map(({ id, word, ipa, thaiMeaning, thaiReading, type, level, example, exampleThai, synonyms, tags, audioUrl }) => ({
    id, word, ipa, thaiMeaning, thaiReading, type, level, example, exampleThai, synonyms, tags, audioUrl,
  }))

export const getRandomCards = (count: number): VocabularyCard[] => {
  const shuffled = [...vocabularyData].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export const getCardsByLevel = (level: string): VocabularyCard[] =>
  vocabularyData.filter((card) => card.level === level)

export const getCardsByTag = (tag: string): VocabularyCard[] =>
  vocabularyData.filter((card) => card.tags.includes(tag))

export const searchCards = (query: string): VocabularyCard[] => {
  const lowercaseQuery = query.toLowerCase()
  return vocabularyData.filter(
    (card) =>
      card.word.toLowerCase().includes(lowercaseQuery) ||
      card.thaiMeaning.includes(query) ||
      card.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
  )
}
