import type { VocabularyCard, VocabularyWithProgress, WordType, CEFRLevel } from '@/types'
import { isDue } from '@/lib/spacedRepetition'
import { createInitialSM2State } from '@/lib/spacedRepetition'

export function parseSynonyms(value: string | string[]): string[] {
  if (Array.isArray(value)) return value
  try {
    const parsed = JSON.parse(value) as unknown
    return Array.isArray(parsed) ? (parsed as string[]) : []
  } catch {
    return []
  }
}

export function cardToWithProgress(
  card: VocabularyCard,
  progress?: Partial<VocabularyWithProgress>
): VocabularyWithProgress {
  const initial = createInitialSM2State()
  return {
    ...card,
    nextReview: progress?.nextReview ?? initial.nextReview.toISOString(),
    reviewCount: progress?.reviewCount ?? 0,
    easeFactor: progress?.easeFactor ?? initial.easeFactor,
    interval: progress?.interval ?? initial.interval,
    lastReviewed: progress?.lastReviewed ?? null,
  }
}

export function filterDueCards(cards: VocabularyWithProgress[], now = new Date()): VocabularyWithProgress[] {
  return cards.filter((c) => isDue(c.nextReview, now))
}

export function filterByLevel(cards: VocabularyCard[], level: CEFRLevel): VocabularyCard[] {
  return cards.filter((c) => c.level === level)
}

export function filterByTag(cards: VocabularyCard[], tag: string): VocabularyCard[] {
  return cards.filter((c) => c.tags.includes(tag))
}

export function searchVocabulary(cards: VocabularyCard[], query: string): VocabularyCard[] {
  const q = query.toLowerCase().trim()
  if (!q) return cards
  return cards.filter(
    (card) =>
      card.word.toLowerCase().includes(q) ||
      card.thaiMeaning.includes(query) ||
      card.tags.some((tag) => tag.toLowerCase().includes(q))
  )
}

export function shuffleCards<T>(cards: T[]): T[] {
  const copy = [...cards]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export const LEVEL_COLORS: Record<CEFRLevel, string> = {
  A1: 'bg-accent/20 text-accent-foreground',
  A2: 'bg-accent/30 text-accent-foreground',
  B1: 'bg-primary/20 text-primary',
  B2: 'bg-primary/30 text-primary',
  C1: 'bg-chart-4/20 text-chart-4',
  C2: 'bg-chart-4/30 text-chart-4',
}

export const TYPE_COLORS: Record<WordType, string> = {
  noun: 'bg-chart-2/20 text-chart-2',
  verb: 'bg-chart-1/20 text-chart-1',
  adjective: 'bg-chart-3/20 text-chart-3',
  adverb: 'bg-chart-4/20 text-chart-4',
  preposition: 'bg-chart-5/20 text-chart-5',
  conjunction: 'bg-muted text-muted-foreground',
  pronoun: 'bg-accent/20 text-accent',
  determiner: 'bg-secondary text-secondary-foreground',
  exclamation: 'bg-destructive/20 text-destructive',
}
