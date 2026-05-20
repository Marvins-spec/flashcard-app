export interface WeeklyData {
  day: string
  reviews: number
  correct: number
}

export interface HeatmapData {
  date: string
  count: number
}

export interface UserStats {
  totalWordsLearned: number
  totalReviews: number
  correctAnswers: number
  streak: number
  longestStreak: number
  lastStudyDate: string | null
  dailyGoal: number
  todayReviews: number
  weeklyData: WeeklyData[]
  monthlyHeatmap: HeatmapData[]
}

export interface StudySession {
  id: string
  startTime: Date
  endTime?: Date
  cardsReviewed: number
  correctAnswers: number
  mode: import('./vocabulary').StudyMode
}

export interface RetentionMetrics {
  retentionRate: number
  accuracyRate: number
  reviewsToday: number
}
