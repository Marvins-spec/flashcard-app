import type { CEFRLevel, HeatmapData, UserStats, VocabularyWithProgress, WeeklyData } from '@/types'
import { isWordLearned } from './vocabulary'
import { toDateKey } from './date'

export interface RetentionLevelStat {
  level: CEFRLevel
  total: number
  learned: number
  percentage: number
}

const CEFR_LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

export function computeRetentionByLevel(
  vocabulary: VocabularyWithProgress[]
): RetentionLevelStat[] {
  return CEFR_LEVELS.map((level) => {
    const atLevel = vocabulary.filter((v) => v.level === level)
    const total = atLevel.length
    const learned = atLevel.filter(isWordLearned).length
    return {
      level,
      total,
      learned,
      percentage: total > 0 ? Math.round((learned / total) * 100) : 0,
    }
  }).filter((item) => item.total > 0)
}

export function computeRetentionRate(vocabulary: VocabularyWithProgress[]): number {
  if (vocabulary.length === 0) return 0
  const learned = vocabulary.filter(isWordLearned).length
  return Math.round((learned / vocabulary.length) * 100)
}

export function calculateAccuracy(totalReviews: number, correctAnswers: number): number {
  if (totalReviews === 0) return 0
  return Math.round((correctAnswers / totalReviews) * 100)
}

export function calculateRetentionRate(
  learnedCount: number,
  reviewedCount: number
): number {
  if (reviewedCount === 0) return 0
  return Math.round((learnedCount / reviewedCount) * 100)
}

export function updateStreak(
  currentStreak: number,
  longestStreak: number,
  lastStudyDate: string | null,
  now = new Date()
): { streak: number; longestStreak: number; lastStudyDate: string } {
  const today = toDateKey(now)
  if (!lastStudyDate) {
    return { streak: 1, longestStreak: Math.max(1, longestStreak), lastStudyDate: today }
  }

  if (lastStudyDate === today) {
    return { streak: currentStreak, longestStreak, lastStudyDate: today }
  }

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayKey = toDateKey(yesterday)

  const newStreak = lastStudyDate === yesterdayKey ? currentStreak + 1 : 1
  return {
    streak: newStreak,
    longestStreak: Math.max(longestStreak, newStreak),
    lastStudyDate: today,
  }
}

export function bumpHeatmap(heatmap: HeatmapData[], date = toDateKey()): HeatmapData[] {
  const copy = [...heatmap]
  const idx = copy.findIndex((d) => d.date === date)
  if (idx >= 0) {
    copy[idx] = { ...copy[idx], count: copy[idx].count + 1 }
  } else {
    copy.push({ date, count: 1 })
  }
  return copy
}

export function generateEmptyHeatmap(days = 90): HeatmapData[] {
  const data: HeatmapData[] = []
  const today = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    data.push({ date: toDateKey(date), count: 0 })
  }
  return data
}

export function generateEmptyWeeklyData(): WeeklyData[] {
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => ({
    day,
    reviews: 0,
    correct: 0,
  }))
}

export function createDefaultUserStats(dailyGoal = 20): UserStats {
  return {
    totalWordsLearned: 0,
    totalReviews: 0,
    correctAnswers: 0,
    streak: 0,
    longestStreak: 0,
    lastStudyDate: null,
    dailyGoal,
    todayReviews: 0,
    weeklyData: generateEmptyWeeklyData(),
    monthlyHeatmap: generateEmptyHeatmap(),
  }
}
