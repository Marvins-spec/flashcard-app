import { loadAllVocabularyCards } from './load-vocabulary'
import vocabularyLegacy from './vocabulary.json'

export const vocabularyData = loadAllVocabularyCards()
export const vocabularySeed = vocabularyData
export { loadAllVocabularyCards, getVocabularyByLevel } from './load-vocabulary'
export { default as vocabularyLegacy } from './vocabulary.json'
