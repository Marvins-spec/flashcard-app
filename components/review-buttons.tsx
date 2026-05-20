'use client'

import { motion } from 'framer-motion'
import type { ReviewRating } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ReviewButtonsProps {
  onRate: (rating: ReviewRating) => void
  disabled?: boolean
}

const buttons: { rating: ReviewRating; label: string; shortcut: string; color: string }[] = [
  {
    rating: 'again',
    label: 'Again',
    shortcut: '1',
    color: 'bg-destructive/10 hover:bg-destructive/20 text-destructive border-destructive/30',
  },
  {
    rating: 'hard',
    label: 'Hard',
    shortcut: '2',
    color: 'bg-warning/10 hover:bg-warning/20 text-warning-foreground border-warning/30',
  },
  {
    rating: 'good',
    label: 'Good',
    shortcut: '3',
    color: 'bg-primary/10 hover:bg-primary/20 text-primary border-primary/30',
  },
  {
    rating: 'easy',
    label: 'Easy',
    shortcut: '4',
    color: 'bg-success/10 hover:bg-success/20 text-success border-success/30',
  },
]

export function ReviewButtons({ onRate, disabled }: ReviewButtonsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-3">
      {buttons.map((button, index) => (
        <motion.button
          key={button.rating}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onRate(button.rating)}
          disabled={disabled}
          className={cn(
            'flex flex-col items-center justify-center px-4 py-3 md:px-6 md:py-4 rounded-xl border transition-all',
            'min-w-[70px] md:min-w-[90px]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            button.color
          )}
        >
          <span className="font-semibold text-sm md:text-base">{button.label}</span>
          <span className="text-xs opacity-60 mt-1">{button.shortcut}</span>
        </motion.button>
      ))}
    </div>
  )
}
