import type { ReviewRating } from '@/types'

export interface SM2State {
  easeFactor: number
  interval: number
  repetitions: number
  nextReview: Date
  lastReviewed: Date
}

export interface SM2Input {
  easeFactor: number
  interval: number
  repetitions: number
  lastReviewed?: Date | null
}

const MIN_EASE = 1.3
const DEFAULT_EASE = 2.5

export function createInitialSM2State(now = new Date()): SM2State {
  return {
    easeFactor: DEFAULT_EASE,
    interval: 0,
    repetitions: 0,
    nextReview: now,
    lastReviewed: now,
  }
}

export function sm2FromProgress(input: SM2Input, now = new Date()): SM2State {
  const lastReviewed = input.lastReviewed ? new Date(input.lastReviewed) : now
  const nextReview = new Date(now)
  if (input.interval > 0) {
    nextReview.setDate(nextReview.getDate() + input.interval)
  }
  return {
    easeFactor: input.easeFactor,
    interval: input.interval,
    repetitions: input.repetitions,
    nextReview,
    lastReviewed,
  }
}

/**
 * Simplified SM-2 algorithm for flashcard ratings.
 * Maps Again/Hard/Good/Easy to interval and ease updates.
 */
export function applySM2Rating(
  state: SM2Input,
  rating: ReviewRating,
  now = new Date()
): SM2State {
  let { easeFactor, interval, repetitions } = state
  easeFactor = easeFactor || DEFAULT_EASE

  switch (rating) {
    case 'again':
      repetitions = 0
      interval = 0
      easeFactor = Math.max(MIN_EASE, easeFactor - 0.2)
      break
    case 'hard':
      if (repetitions === 0) {
        interval = 1
      } else {
        interval = Math.max(1, Math.round(interval * 1.2))
      }
      repetitions += 1
      easeFactor = Math.max(MIN_EASE, easeFactor - 0.15)
      break
    case 'good':
      if (repetitions === 0) {
        interval = 1
      } else if (repetitions === 1) {
        interval = 6
      } else {
        interval = Math.round(interval * easeFactor)
      }
      repetitions += 1
      break
    case 'easy':
      if (repetitions === 0) {
        interval = 4
      } else {
        interval = Math.round(interval * easeFactor * 1.3)
      }
      repetitions += 1
      easeFactor = easeFactor + 0.15
      break
  }

  const nextReview = new Date(now)
  const daysUntilReview = rating === 'again' ? 0 : Math.max(1, interval)
  if (rating === 'again') {
    nextReview.setMinutes(nextReview.getMinutes() + 10)
  } else {
    nextReview.setDate(nextReview.getDate() + daysUntilReview)
  }

  return {
    easeFactor,
    interval,
    repetitions,
    nextReview,
    lastReviewed: now,
  }
}

export function isDue(nextReview: Date | string, now = new Date()): boolean {
  return new Date(nextReview) <= now
}

export function ratingToQuality(rating: ReviewRating): number {
  const map: Record<ReviewRating, number> = {
    again: 0,
    hard: 3,
    good: 4,
    easy: 5,
  }
  return map[rating]
}

export function isCorrectRating(rating: ReviewRating): boolean {
  return rating === 'good' || rating === 'easy'
}
