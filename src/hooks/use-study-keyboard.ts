'use client'

import { useEffect } from 'react'
import type { ReviewRating } from '@/types'

interface UseStudyKeyboardOptions {
  enabled: boolean
  canFlip: boolean
  canRate: boolean
  onFlip: () => void
  onRate: (rating: ReviewRating) => void
}

export function useStudyKeyboard({
  enabled,
  canFlip,
  canRate,
  onFlip,
  onRate,
}: UseStudyKeyboardOptions) {
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      if (e.code === 'Space' && canFlip) {
        e.preventDefault()
        onFlip()
        return
      }

      if (!canRate) return

      const ratings: Record<string, ReviewRating> = {
        '1': 'again',
        '2': 'hard',
        '3': 'good',
        '4': 'easy',
      }

      const rating = ratings[e.key]
      if (rating) {
        e.preventDefault()
        onRate(rating)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enabled, canFlip, canRate, onFlip, onRate])
}
