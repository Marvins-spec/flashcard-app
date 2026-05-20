export type WordType =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'preposition'
  | 'conjunction'
  | 'pronoun'
  | 'determiner'
  | 'exclamation'

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

export type ReviewRating = 'again' | 'hard' | 'good' | 'easy'

export type StudyMode = 'flip' | 'typing' | 'listening' | 'fill-blank'

export interface VocabularyBase {
  word: string
  ipa: string
  thaiMeaning: string
  thaiReading: string
  type: WordType
  level: CEFRLevel
  example: string
  exampleThai: string
  synonyms: string[]
  tags: string[]
  audioUrl?: string
}

/** Raw entry shape in level JSON files (a1.json, a2.json, …) */
export interface VocabularySeedEntry extends VocabularyBase {
  difficulty: number
  frequencyRank: number
}

export interface SpacedRepetitionFields {
  nextReview: string | Date
  reviewCount: number
  easeFactor: number
  interval: number
  lastReviewed: string | Date | null
}

export interface VocabularyCard extends VocabularyBase {
  id: string
}

export interface VocabularyWithProgress extends VocabularyCard, SpacedRepetitionFields {}

export interface StudyProgress {
  cardId: string
  lastReviewed: Date
  nextReview: Date
  easeFactor: number
  interval: number
  repetitions: number
  rating: ReviewRating | null
}

/** @deprecated Use VocabularyCard — kept for incremental migration */
export type { VocabularyCard as LegacyVocabularyCard }
