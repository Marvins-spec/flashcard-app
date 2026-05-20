import { prisma } from '@/lib/prisma'
import type { HeatmapData, UserStats, WeeklyData } from '@/types'
import { createDefaultUserStats } from '@/utils/statistics'

function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export const statisticsRepository = {
  async get(): Promise<UserStats> {
    const row = await prisma.statistics.findUnique({ where: { id: 'default' } })
    if (!row) return createDefaultUserStats()
    return {
      totalWordsLearned: row.totalWordsLearned,
      totalReviews: row.totalReviews,
      correctAnswers: row.correctAnswers,
      streak: row.streak,
      longestStreak: row.longestStreak,
      lastStudyDate: row.lastStudyDate,
      dailyGoal: 20,
      todayReviews: row.todayReviews,
      weeklyData: parseJson<WeeklyData[]>(row.weeklyData, []),
      monthlyHeatmap: parseJson<HeatmapData[]>(row.heatmapData, []),
    }
  },

  async save(stats: UserStats): Promise<void> {
    await prisma.statistics.upsert({
      where: { id: 'default' },
      create: {
        id: 'default',
        totalReviews: stats.totalReviews,
        correctAnswers: stats.correctAnswers,
        totalWordsLearned: stats.totalWordsLearned,
        streak: stats.streak,
        longestStreak: stats.longestStreak,
        lastStudyDate: stats.lastStudyDate,
        todayReviews: stats.todayReviews,
        heatmapData: JSON.stringify(stats.monthlyHeatmap),
        weeklyData: JSON.stringify(stats.weeklyData),
      },
      update: {
        totalReviews: stats.totalReviews,
        correctAnswers: stats.correctAnswers,
        totalWordsLearned: stats.totalWordsLearned,
        streak: stats.streak,
        longestStreak: stats.longestStreak,
        lastStudyDate: stats.lastStudyDate,
        todayReviews: stats.todayReviews,
        heatmapData: JSON.stringify(stats.monthlyHeatmap),
        weeklyData: JSON.stringify(stats.weeklyData),
      },
    })
  },
}
