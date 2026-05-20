'use client'

import { motion } from 'framer-motion'
import { Flame, BookOpen, Target, TrendingUp, ChevronRight, Volume2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useStudy } from '@/lib/study-context'
import { useDueCards, useWeakWords, useVocabularyInit } from '@/hooks/use-vocabulary'
import { useStudyStats } from '@/store/study-store'
import { DashboardSkeleton } from '@/components/ui/page-skeleton'
import { AudioButton } from '@/components/audio-button'
import { LEVEL_COLORS } from '@/lib/utils'
import { StatCard } from '@/components/stat-card'
import { ProgressRing } from '@/components/progress-ring'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  const { startStudy } = useStudy()
  const { userStats, accuracy } = useStudyStats()
  const { hydrated } = useVocabularyInit()
  const dueCards = useDueCards()
  const weakWords = useWeakWords()

  const dailyProgress = Math.round((userStats.todayReviews / userStats.dailyGoal) * 100)

  if (!hydrated) {
    return (
      <div className="min-h-screen pb-24 md:pb-8 md:pl-64">
        <DashboardSkeleton />
      </div>
    )
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
            Good morning!
          </motion.h1>
          <p className="text-muted-foreground">Ready to expand your vocabulary today?</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
          <StatCard
            title="Today&apos;s Reviews"
            value={userStats.todayReviews}
            subtitle={`Goal: ${userStats.dailyGoal}`}
            icon={<BookOpen className="h-5 w-5" />}
          />
          <StatCard
            title="Current Streak"
            value={`${userStats.streak} days`}
            icon={<Flame className="h-5 w-5 text-chart-3" />}
            trend={{ value: 15, isPositive: true }}
          />
          <StatCard
            title="Words Learned"
            value={userStats.totalWordsLearned}
            subtitle="Oxford 3000"
            icon={<Target className="h-5 w-5" />}
          />
          <StatCard
            title="Accuracy"
            value={`${accuracy}%`}
            icon={<TrendingUp className="h-5 w-5" />}
            trend={{ value: 3, isPositive: true }}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 rounded-2xl border border-border bg-card p-6"
          >
            <h2 className="font-semibold text-foreground mb-6">Daily Progress</h2>
            <div className="flex flex-col items-center">
              <ProgressRing 
                progress={Math.min(dailyProgress, 100)} 
                size={140} 
                strokeWidth={10}
                label="complete"
              />
              <div className="mt-6 text-center">
                <p className="text-2xl font-bold text-foreground">
                  {userStats.todayReviews} / {userStats.dailyGoal}
                </p>
                <p className="text-sm text-muted-foreground">cards reviewed today</p>
              </div>
              <Link href="/study" className="w-full mt-6">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() =>
                    startStudy(
                      dueCards.map(({ id, word, ipa, thaiMeaning, thaiReading, type, level, example, exampleThai, synonyms, tags, audioUrl }) => ({
                        id, word, ipa, thaiMeaning, thaiReading, type, level, example, exampleThai, synonyms, tags, audioUrl,
                      }))
                    )
                  }
                >
                  Start Review
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Due Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Due for Review</h2>
              <span className="text-sm text-muted-foreground">{dueCards.length} cards</span>
            </div>
            <div className="space-y-3">
              {dueCards.slice(0, 5).map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <AudioButton word={card.word} audioUrl={card.audioUrl} size="sm" className="h-8 w-8" />
                    <div>
                      <p className="font-medium text-foreground">{card.word}</p>
                      <p className="text-sm text-muted-foreground">{card.thaiMeaning}</p>
                    </div>
                  </div>
                  <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', LEVEL_COLORS[card.level])}>
                    {card.level}
                  </span>
                </motion.div>
              ))}
            </div>
            <Link href="/words">
              <Button variant="ghost" className="w-full mt-4">
                View all words
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Weak Words Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 rounded-2xl border border-border bg-card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5 text-warning" />
            <h2 className="font-semibold text-foreground">Words to Focus On</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            These words need more practice based on your review history
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {weakWords.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="p-4 rounded-xl bg-warning/5 border border-warning/20 hover:border-warning/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', LEVEL_COLORS[card.level])}>
                    {card.level}
                  </span>
                  <AudioButton word={card.word} audioUrl={card.audioUrl} size="sm" className="h-6 w-6" />
                </div>
                <p className="font-semibold text-foreground">{card.word}</p>
                <p className="text-sm text-muted-foreground truncate">{card.thaiMeaning}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 rounded-2xl border border-border bg-gradient-to-r from-primary/10 to-accent/10 p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Reviews</p>
              <p className="text-2xl font-bold text-foreground">{userStats.totalReviews.toLocaleString()}</p>
            </div>
            <div className="h-12 w-px bg-border hidden sm:block" />
            <div>
              <p className="text-sm text-muted-foreground">Correct Answers</p>
              <p className="text-2xl font-bold text-foreground">{userStats.correctAnswers.toLocaleString()}</p>
            </div>
            <div className="h-12 w-px bg-border hidden sm:block" />
            <div>
              <p className="text-sm text-muted-foreground">Learning Progress</p>
              <p className="text-2xl font-bold text-foreground">
                {Math.round((userStats.totalWordsLearned / 3000) * 100)}%
              </p>
            </div>
            <Link href="/statistics">
              <Button variant="outline">
                View Statistics
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
