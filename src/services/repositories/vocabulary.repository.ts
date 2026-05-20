import { prisma } from '@/lib/prisma'
import type { VocabularyCard, VocabularyWithProgress } from '@/types'
import { parseSynonyms } from '@/utils/vocabulary'

function mapRow(row: {
  id: string
  word: string
  ipa: string
  thaiMeaning: string
  thaiReading: string
  type: string
  level: string
  example: string
  exampleThai: string
  synonyms: string
  tags: string
  audioUrl: string | null
  nextReview: Date
  reviewCount: number
  easeFactor: number
  interval: number
  lastReviewed: Date | null
}): VocabularyWithProgress {
  return {
    id: row.id,
    word: row.word,
    ipa: row.ipa,
    thaiMeaning: row.thaiMeaning,
    thaiReading: row.thaiReading,
    type: row.type as VocabularyCard['type'],
    level: row.level as VocabularyCard['level'],
    example: row.example,
    exampleThai: row.exampleThai,
    synonyms: parseSynonyms(row.synonyms),
    tags: parseSynonyms(row.tags),
    audioUrl: row.audioUrl ?? undefined,
    nextReview: row.nextReview.toISOString(),
    reviewCount: row.reviewCount,
    easeFactor: row.easeFactor,
    interval: row.interval,
    lastReviewed: row.lastReviewed?.toISOString() ?? null,
  }
}

export const vocabularyRepository = {
  async findAll(): Promise<VocabularyWithProgress[]> {
    const rows = await prisma.vocabulary.findMany({ orderBy: { word: 'asc' } })
    return rows.map(mapRow)
  },

  async findDue(now = new Date()): Promise<VocabularyWithProgress[]> {
    const rows = await prisma.vocabulary.findMany({
      where: { nextReview: { lte: now } },
      orderBy: { nextReview: 'asc' },
    })
    return rows.map(mapRow)
  },

  async findById(id: string): Promise<VocabularyWithProgress | null> {
    const row = await prisma.vocabulary.findUnique({ where: { id } })
    return row ? mapRow(row) : null
  },

  async upsertMany(cards: VocabularyCard[]): Promise<number> {
    let count = 0
    for (const card of cards) {
      await prisma.vocabulary.upsert({
        where: { word: card.word },
        create: {
          word: card.word,
          ipa: card.ipa,
          thaiMeaning: card.thaiMeaning,
          thaiReading: card.thaiReading,
          type: card.type,
          level: card.level,
          example: card.example,
          exampleThai: card.exampleThai,
          synonyms: JSON.stringify(card.synonyms),
          tags: JSON.stringify(card.tags),
          audioUrl: card.audioUrl,
        },
        update: {
          ipa: card.ipa,
          thaiMeaning: card.thaiMeaning,
          thaiReading: card.thaiReading,
          type: card.type,
          level: card.level,
          example: card.example,
          exampleThai: card.exampleThai,
          synonyms: JSON.stringify(card.synonyms),
          tags: JSON.stringify(card.tags),
          audioUrl: card.audioUrl,
        },
      })
      count++
    }
    return count
  },

  async updateProgress(
    id: string,
    data: {
      nextReview: Date
      reviewCount: number
      easeFactor: number
      interval: number
      lastReviewed: Date
    }
  ): Promise<VocabularyWithProgress> {
    const row = await prisma.vocabulary.update({
      where: { id },
      data,
    })
    return mapRow(row)
  },
}
