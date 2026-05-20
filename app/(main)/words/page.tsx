'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Volume2, ChevronRight, X } from 'lucide-react'
import Link from 'next/link'
import { vocabularyData } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { CEFRLevel, WordType } from '@/lib/types'

const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const wordTypes: WordType[] = ['noun', 'verb', 'adjective', 'adverb', 'preposition']

export default function WordsPage() {
  const [search, setSearch] = useState('')
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel | null>(null)
  const [selectedType, setSelectedType] = useState<WordType | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const filteredWords = useMemo(() => {
    return vocabularyData.filter((word) => {
      const matchesSearch = 
        word.word.toLowerCase().includes(search.toLowerCase()) ||
        word.thaiMeaning.includes(search) ||
        word.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
      
      const matchesLevel = !selectedLevel || word.level === selectedLevel
      const matchesType = !selectedType || word.type === selectedType

      return matchesSearch && matchesLevel && matchesType
    })
  }, [search, selectedLevel, selectedType])

  const levelColors: Record<string, string> = {
    A1: 'bg-accent/20 text-accent-foreground border-accent/30',
    A2: 'bg-accent/30 text-accent-foreground border-accent/40',
    B1: 'bg-primary/20 text-primary border-primary/30',
    B2: 'bg-primary/30 text-primary border-primary/40',
    C1: 'bg-chart-4/20 text-chart-4 border-chart-4/30',
    C2: 'bg-chart-4/30 text-chart-4 border-chart-4/40',
  }

  const typeColors: Record<string, string> = {
    noun: 'bg-chart-2/20 text-chart-2',
    verb: 'bg-chart-1/20 text-chart-1',
    adjective: 'bg-chart-3/20 text-chart-3',
    adverb: 'bg-chart-4/20 text-chart-4',
    preposition: 'bg-chart-5/20 text-chart-5',
  }

  const clearFilters = () => {
    setSelectedLevel(null)
    setSelectedType(null)
    setSearch('')
  }

  const hasActiveFilters = selectedLevel || selectedType || search

  return (
    <div className="min-h-screen pb-24 md:pb-8 md:pl-64">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-6">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-2"
          >
            All Words
          </motion.h1>
          <p className="text-muted-foreground">
            Browse and search through the Oxford 3000 vocabulary
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search words, meanings, or tags..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(showFilters && 'bg-secondary')}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                {(selectedLevel ? 1 : 0) + (selectedType ? 1 : 0)}
              </span>
            )}
          </Button>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="p-4 rounded-xl border border-border bg-card space-y-4">
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">CEFR Level</p>
                  <div className="flex flex-wrap gap-2">
                    {levels.map((level) => (
                      <button
                        key={level}
                        onClick={() => setSelectedLevel(selectedLevel === level ? null : level)}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-sm font-medium border transition-all',
                          selectedLevel === level
                            ? levelColors[level]
                            : 'border-border bg-secondary/50 text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Word Type</p>
                  <div className="flex flex-wrap gap-2">
                    {wordTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedType(selectedType === type ? null : type)}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-sm font-medium border transition-all capitalize',
                          selectedType === type
                            ? cn(typeColors[type], 'border-current')
                            : 'border-border bg-secondary/50 text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Clear filters
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-4">
          Showing {filteredWords.length} of {vocabularyData.length} words
        </p>

        {/* Words Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatePresence mode="popLayout">
            {filteredWords.map((word, index) => (
              <motion.div
                key={word.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.02 }}
              >
                <Link
                  href={`/words/${word.id}`}
                  className="block p-4 rounded-xl border border-border bg-card hover:bg-secondary/50 hover:border-primary/30 transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', levelColors[word.level])}>
                        {word.level}
                      </span>
                      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium capitalize', typeColors[word.type])}>
                        {word.type}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.preventDefault()
                        if ('speechSynthesis' in window) {
                          const utterance = new SpeechSynthesisUtterance(word.word)
                          utterance.lang = 'en-US'
                          speechSynthesis.speak(utterance)
                        }
                      }}
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                    {word.word}
                  </h3>
                  <p className="text-sm text-muted-foreground font-mono mb-1">{word.ipa}</p>
                  <p className="text-sm text-muted-foreground">{word.thaiMeaning}</p>
                  
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <div className="flex flex-wrap gap-1">
                      {word.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-xs text-primary/70">#{tag}</span>
                      ))}
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredWords.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground">No words found matching your criteria</p>
            <Button variant="ghost" onClick={clearFilters} className="mt-4">
              Clear filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
