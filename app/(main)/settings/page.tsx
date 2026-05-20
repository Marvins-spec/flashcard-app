'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Moon, Sun, Monitor, Volume2, Bell, Target, Palette, Info } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [dailyGoal, setDailyGoal] = useState(20)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  const themeOptions = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ]

  const goalOptions = [10, 15, 20, 30, 50]

  return (
    <div className="min-h-screen pb-24 md:pb-8 md:pl-64">
      <div className="max-w-3xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-2"
          >
            Settings
          </motion.h1>
          <p className="text-muted-foreground">Customize your learning experience</p>
        </div>

        <div className="space-y-6">
          {/* Appearance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Palette className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Appearance</h2>
                <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all',
                    theme === option.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-secondary/50 text-muted-foreground hover:text-foreground hover:border-primary/30'
                  )}
                >
                  <option.icon className="h-6 w-6" />
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Daily Goal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <Target className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Daily Goal</h2>
                <p className="text-sm text-muted-foreground">Set your daily review target</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {goalOptions.map((goal) => (
                <button
                  key={goal}
                  onClick={() => setDailyGoal(goal)}
                  className={cn(
                    'px-4 py-2 rounded-xl border transition-all font-medium',
                    dailyGoal === goal
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-secondary/50 text-muted-foreground hover:text-foreground hover:border-primary/30'
                  )}
                >
                  {goal} cards
                </button>
              ))}
            </div>
          </motion.div>

          {/* Sound */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-chart-2/20 flex items-center justify-center">
                  <Volume2 className="h-5 w-5 text-chart-2" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Sound Effects</h2>
                  <p className="text-sm text-muted-foreground">Play sounds during study</p>
                </div>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={cn(
                  'relative w-12 h-7 rounded-full transition-colors',
                  soundEnabled ? 'bg-primary' : 'bg-muted'
                )}
              >
                <div
                  className={cn(
                    'absolute top-1 w-5 h-5 rounded-full bg-white transition-transform',
                    soundEnabled ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-chart-3/20 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-chart-3" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Study Reminders</h2>
                  <p className="text-sm text-muted-foreground">Get notified to study daily</p>
                </div>
              </div>
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={cn(
                  'relative w-12 h-7 rounded-full transition-colors',
                  notificationsEnabled ? 'bg-primary' : 'bg-muted'
                )}
              >
                <div
                  className={cn(
                    'absolute top-1 w-5 h-5 rounded-full bg-white transition-transform',
                    notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </div>
          </motion.div>

          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <Info className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">About</h2>
                <p className="text-sm text-muted-foreground">VocabMaster - Oxford 3000</p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-muted-foreground">
              <p>Version 1.0.0</p>
              <p>
                A spaced repetition flashcard app designed to help you master the Oxford 3000 
                vocabulary list with Thai translations.
              </p>
              <div className="pt-3 border-t border-border">
                <p className="font-medium text-foreground mb-2">Features:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Spaced repetition algorithm</li>
                  <li>Multiple study modes</li>
                  <li>Progress tracking and statistics</li>
                  <li>Dark mode support</li>
                  <li>Keyboard shortcuts</li>
                  <li>Audio pronunciation</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Reset Data */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6"
          >
            <h2 className="font-semibold text-foreground mb-2">Danger Zone</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Reset all your progress and start fresh. This action cannot be undone.
            </p>
            <Button variant="destructive">
              Reset All Progress
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
