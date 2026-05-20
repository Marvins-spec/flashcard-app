import type { VocabularyCard, VocabularySeedEntry, CEFRLevel, WordType } from '@/types'
import legacyVocabulary from './vocabulary.json'
import a1Data from './a1.json'
import a2Data from './a2.json'
import b1Data from './b1.json'
import b2Data from './b2.json'

const LEVEL_FILES: { file: VocabularySeedEntry[]; prefix: string }[] = [
  { file: a1Data as VocabularySeedEntry[], prefix: 'a1' },
  { file: a2Data as VocabularySeedEntry[], prefix: 'a2' },
  { file: b1Data as VocabularySeedEntry[], prefix: 'b1' },
  { file: b2Data as VocabularySeedEntry[], prefix: 'b2' },
]

type LegacyEntry = VocabularyCard & Partial<VocabularySeedEntry>

function slugId(word: string, prefix: string): string {
  return `${prefix}-${word.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
}

function normalizeSeedEntry(
  entry: VocabularySeedEntry,
  prefix: string,
  index: number
): VocabularyCard {
  return {
    id: slugId(entry.word, prefix),
    word: entry.word,
    ipa: entry.ipa,
    thaiMeaning: entry.thaiMeaning,
    thaiReading: entry.thaiReading,
    type: entry.type as WordType,
    level: entry.level as CEFRLevel,
    example: entry.example,
    exampleThai: entry.exampleThai,
    synonyms: entry.synonyms ?? [],
    tags: entry.tags ?? [],
    audioUrl: entry.audioUrl,
  }
}

function normalizeLegacy(entry: LegacyEntry, index: number): VocabularyCard {
  return {
    id: entry.id ?? `legacy-${index + 1}`,
    word: entry.word,
    ipa: entry.ipa,
    thaiMeaning: entry.thaiMeaning,
    thaiReading: entry.thaiReading,
    type: entry.type as WordType,
    level: entry.level as CEFRLevel,
    example: entry.example,
    exampleThai: entry.exampleThai,
    synonyms: entry.synonyms ?? [],
    tags: entry.tags ?? [],
    audioUrl: entry.audioUrl,
  }
}

/**
 * Merges legacy vocabulary.json with level-based JSON files.
 * Deduplicates by word (case-insensitive); legacy entries win on conflict.
 */
export function loadAllVocabularyCards(): VocabularyCard[] {
  const byWord = new Map<string, VocabularyCard>()

  for (const entry of legacyVocabulary as LegacyEntry[]) {
    const card = normalizeLegacy(entry, byWord.size)
    byWord.set(card.word.toLowerCase(), card)
  }

  for (const { file, prefix } of LEVEL_FILES) {
    if (!Array.isArray(file)) continue
    file.forEach((entry, index) => {
      const key = entry.word.toLowerCase()
      if (byWord.has(key)) return
      byWord.set(key, normalizeSeedEntry(entry, prefix, index))
    })
  }

  return Array.from(byWord.values())
}

export function getVocabularyByLevel(level: CEFRLevel): VocabularyCard[] {
  return loadAllVocabularyCards().filter((c) => c.level === level)
}

export { LEVEL_FILES }
