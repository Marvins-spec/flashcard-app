import { writeFileSync, readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { B1_WORDS } from './data/b1-entries.mjs'

const dataDir = join(dirname(fileURLToPath(import.meta.url)), '../src/data')
const REQUIRED = ['word', 'ipa', 'thaiMeaning', 'thaiReading', 'type', 'level', 'example', 'exampleThai', 'synonyms', 'tags', 'difficulty', 'frequencyRank']
const TARGET = 100

function loadExistingWords() {
  const seen = new Set()
  for (const file of ['vocabulary.json', 'a1.json', 'a2.json', 'b1.json', 'b2.json']) {
    const p = join(dataDir, file)
    if (existsSync(p)) {
      JSON.parse(readFileSync(p, 'utf8')).forEach((e) => seen.add(e.word.toLowerCase()))
    }
  }
  return seen
}

function row(...fields) {
  const [word, ipa, thaiMeaning, thaiReading, type, level, example, exampleThai, synonyms, tags, difficulty, frequencyRank] = fields
  return { word, ipa, thaiMeaning, thaiReading, type, level, example, exampleThai, synonyms, tags, difficulty, frequencyRank }
}

function validate(entries) {
  if (!Array.isArray(entries)) throw new Error('Must be array')
  const words = new Set()
  for (const item of entries) {
    for (const key of REQUIRED) {
      if (!(key in item)) throw new Error(`Missing ${key} in ${item.word}`)
    }
    const w = item.word.toLowerCase()
    if (words.has(w)) throw new Error(`Duplicate in file: ${item.word}`)
    words.add(w)
    if (item.level !== 'B1') throw new Error(`Level must be B1: ${item.word}`)
  }
}

const NEW_WORDS = B1_WORDS.map((f) =>
  row(f[0], f[1], f[2], f[3], f[4], 'B1', f[5], f[6], f[7], f[8], f[9], f[10])
)

const globalSeen = loadExistingWords()
const toAdd = NEW_WORDS.filter((e) => !globalSeen.has(e.word.toLowerCase()))

const b1Path = join(dataDir, 'b1.json')
const fileExisted = existsSync(b1Path)
let merged = fileExisted ? JSON.parse(readFileSync(b1Path, 'utf8')) : []
const fileSeen = new Set(merged.map((e) => e.word.toLowerCase()))

for (const entry of toAdd) {
  if (!fileSeen.has(entry.word.toLowerCase())) {
    merged.push(entry)
    fileSeen.add(entry.word.toLowerCase())
  }
}

if (toAdd.length < TARGET && merged.length < TARGET) {
  console.error(`Only ${toAdd.length} new B1 words (${merged.length} in b1.json)`)
  process.exit(1)
}

const isFirstBatch = merged.length === toAdd.length
if (isFirstBatch && merged.length > TARGET) {
  merged = merged.slice(0, TARGET)
}

const json = JSON.stringify(merged, null, 2) + '\n'
JSON.parse(json)
validate(merged)
writeFileSync(b1Path, json)
console.log(`b1.json: ${merged.length} entries (${toAdd.length} new words appended)`)
