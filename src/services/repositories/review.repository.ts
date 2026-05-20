import { prisma } from '@/lib/prisma'
import type { ReviewRating } from '@/types'

export const reviewRepository = {
  async create(params: {
    vocabularyId: string
    rating: ReviewRating
    interval: number
    easeFactor: number
  }) {
    return prisma.reviewHistory.create({
      data: {
        vocabularyId: params.vocabularyId,
        rating: params.rating,
        interval: params.interval,
        easeFactor: params.easeFactor,
      },
    })
  },

  async findRecent(limit = 50) {
    return prisma.reviewHistory.findMany({
      orderBy: { reviewedAt: 'desc' },
      take: limit,
      include: { vocabulary: true },
    })
  },
}
