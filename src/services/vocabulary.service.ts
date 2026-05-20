import type { ReviewRating, VocabularyCard, VocabularyWithProgress } from '@/types'
import { applySM2Rating, isCorrectRating } from '@/lib/spacedRepetition'
import { vocabularyRepository } from './repositories/vocabulary.repository'
import { reviewRepository } from './repositories/review.repository'
import { filterDueCards, cardToWithProgress } from '@/utils/vocabulary'
import { loadAllVocabularyCards } from '@/data/load-vocabulary'

export const vocabularyService = {
  getSeedCards(): VocabularyCard[] {
    return loadAllVocabularyCards()
  },

  async seedIfEmpty(): Promise<number> {
    const existing = await vocabularyRepository.findAll()
    if (existing.length > 0) return existing.length
    return vocabularyRepository.upsertMany(this.getSeedCards())
  },

  async getAll(): Promise<VocabularyWithProgress[]> {
    const rows = await vocabularyRepository.findAll()
    if (rows.length === 0) {
      return this.getSeedCards().map((c) => cardToWithProgress(c))
    }
    return rows
  },

  async getDueQueue(): Promise<VocabularyWithProgress[]> {
    const due = await vocabularyRepository.findDue()
    if (due.length > 0) return due
    return filterDueCards(await this.getAll())
  },

  async rateCard(
    card: VocabularyWithProgress,
    rating: ReviewRating
  ): Promise<VocabularyWithProgress> {
    const sm2 = applySM2Rating(
      {
        easeFactor: card.easeFactor,
        interval: card.interval,
        repetitions: card.reviewCount,
        lastReviewed: card.lastReviewed ? new Date(card.lastReviewed) : null,
      },
      rating
    )

    const updated = await vocabularyRepository.updateProgress(card.id, {
      nextReview: sm2.nextReview,
      reviewCount: sm2.repetitions,
      easeFactor: sm2.easeFactor,
      interval: sm2.interval,
      lastReviewed: sm2.lastReviewed,
    })

    await reviewRepository.create({
      vocabularyId: card.id,
      rating,
      interval: sm2.interval,
      easeFactor: sm2.easeFactor,
    })

    return { ...updated, reviewCount: sm2.repetitions }
  },

  isWeak(card: VocabularyWithProgress): boolean {
    return card.easeFactor < 2.0 || card.reviewCount > 0 && card.interval <= 1
  },

  isLearned(card: VocabularyWithProgress): boolean {
    return card.reviewCount >= 3 && card.interval >= 21
  },
}

export { isCorrectRating }
