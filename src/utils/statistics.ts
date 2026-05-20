import type { HeatmapData, UserStats, WeeklyData } from '@/types'
import { toDateKey } from './date'

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
