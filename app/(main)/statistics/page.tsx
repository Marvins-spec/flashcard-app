'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Calendar, Target, BookOpen, Award } from 'lucide-react'
import type { CEFRLevel } from '@/types'
import { useStudyStats, useStudyStore } from '@/store/study-store'
import { useWeakWords, useVocabularyInit } from '@/hooks/use-vocabulary'
import { computeRetentionByLevel, computeRetentionRate } from '@/utils/statistics'
import { LEVEL_COLORS } from '@/lib/utils'
import { StatCard } from '@/components/stat-card'
import { cn } from '@/lib/utils'

const LEVEL_BAR_COLORS: Record<CEFRLevel, string> = {
  A1: 'bg-accent',
  A2: 'bg-accent',
  B1: 'bg-primary',
  B2: 'bg-primary',
  C1: 'bg-chart-4',
  C2: 'bg-chart-4',
}

export default function StatisticsPage() {
  const { userStats, accuracy } = useStudyStats()
  const weakWords = useWeakWords()
  const vocabulary = useStudyStore((s) => s.vocabulary)
  const retentionByLevel = useMemo(
    () => computeRetentionByLevel(vocabulary),
    [vocabulary]
  )
  const retentionRate = useMemo(() => computeRetentionRate(vocabulary), [vocabulary])
  const totalVocabulary = vocabulary.length
  useVocabularyInit()

  // Calculate max for heatmap intensity
  const maxHeatmapCount = Math.max(...userStats.monthlyHeatmap.map(d => d.count), 1)

  const getHeatmapColor = (count: number) => {
    if (count === 0) return 'bg-muted/30'
    const intensity = count / maxHeatmapCount
    if (intensity < 0.25) return 'bg-primary/20'
    if (intensity < 0.5) return 'bg-primary/40'
    if (intensity < 0.75) return 'bg-primary/60'
    return 'bg-primary/80'
  }

  return (
    <div className="min-h-screen pb-24 md:pb-8 md:pl-64">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-2"
          >
            Statistics
          </motion.h1>
          <p className="text-muted-foreground">Track your learning progress and identify areas for improvement</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
          <StatCard
            title="Total Reviews"
            value={userStats.totalReviews.toLocaleString()}
            icon={<BookOpen className="h-5 w-5" />}
          />
          <StatCard
            title="Retention Rate"
            value={`${retentionRate}%`}
            subtitle={`Accuracy ${accuracy}%`}
            icon={retentionRate >= 50 ? <TrendingUp className="h-5 w-5 text-success" /> : <TrendingDown className="h-5 w-5 text-warning" />}
          />
          <StatCard
            title="Words Mastered"
            value={userStats.totalWordsLearned}
            subtitle={`of ${totalVocabulary}`}
            icon={<Target className="h-5 w-5" />}
          />
          <StatCard
            title="Longest Streak"
            value={`${userStats.streak} days`}
            icon={<Award className="h-5 w-5 text-chart-3" />}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Activity Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <h2 className="font-semibold text-foreground mb-6">Weekly Activity</h2>
            <div className="space-y-4">
              {userStats.weeklyData.map((day, index) => {
                const maxReviews = Math.max(...userStats.weeklyData.map(d => d.reviews), 1)
                const percentage = (day.reviews / maxReviews) * 100
                const correctPercentage = day.reviews > 0 ? (day.correct / day.reviews) * 100 : 0
                
                return (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="space-y-1"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground w-10">{day.day}</span>
                      <span className="text-muted-foreground">
                        {day.reviews} reviews ({Math.round(correctPercentage)}% correct)
                      </span>
                    </div>
                    <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: 0.3 + index * 0.05, duration: 0.5 }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Retention Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <h2 className="font-semibold text-foreground mb-6">Retention by Level</h2>
            <div className="space-y-4">
              {retentionByLevel.length === 0 ? (
                <p className="text-sm text-muted-foreground">No vocabulary loaded yet.</p>
              ) : (
                retentionByLevel.map((item, index) => (
                  <motion.div
                    key={item.level}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className="space-y-1"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded-full text-xs font-medium',
                            LEVEL_COLORS[item.level]
                          )}
                        >
                          {item.level}
                        </span>
                      </div>
                      <span className="text-muted-foreground">
                        {item.learned}/{item.total} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ delay: 0.4 + index * 0.05, duration: 0.5 }}
                        className={cn('h-full rounded-full', LEVEL_BAR_COLORS[item.level])}
                      />
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Study Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-border bg-card p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Study Heatmap</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Your study activity over the last 90 days</p>
          
          <div className="overflow-x-auto">
            <div className="flex flex-wrap gap-1" style={{ maxWidth: '100%' }}>
              {userStats.monthlyHeatmap.map((day, index) => (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.01 * index }}
                  className={cn(
                    'w-3 h-3 rounded-sm cursor-pointer transition-transform hover:scale-125',
                    getHeatmapColor(day.count)
                  )}
                  title={`${day.date}: ${day.count} reviews`}
                />
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-2 mt-4 text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-muted/30" />
              <div className="w-3 h-3 rounded-sm bg-primary/20" />
              <div className="w-3 h-3 rounded-sm bg-primary/40" />
              <div className="w-3 h-3 rounded-sm bg-primary/60" />
              <div className="w-3 h-3 rounded-sm bg-primary/80" />
            </div>
            <span>More</span>
          </div>
        </motion.div>

        {/* Weakest Words */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <h2 className="font-semibold text-foreground mb-2">Words Needing Practice</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Based on your performance, focus on these words
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {weakWords.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="p-4 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{card.word}</h3>
                    <p className="text-sm text-muted-foreground">{card.thaiMeaning}</p>
                  </div>
                  <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', LEVEL_COLORS[card.level])}>
                    {card.level}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <div className="h-1.5 flex-1 bg-destructive/20 rounded-full overflow-hidden">
                    <div className="h-full bg-destructive rounded-full" style={{ width: '35%' }} />
                  </div>
                  <span className="text-xs text-destructive">35%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
