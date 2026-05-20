'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Shuffle, BookOpen, Headphones, PenLine } from 'lucide-react'
import Link from 'next/link'
import { useStudy } from '@/lib/study-context'
import { Flashcard } from '@/components/flashcard'
import { ReviewButtons } from '@/components/review-buttons'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { StudySkeleton } from '@/components/ui/page-skeleton'
import { TypingMode } from '@/components/study/typing-mode'
import { ListeningMode } from '@/components/study/listening-mode'
import { FillBlankMode } from '@/components/study/fill-blank-mode'
import { useStudyKeyboard } from '@/hooks/use-study-keyboard'
import { useVocabularyInit } from '@/hooks/use-vocabulary'
import type { StudyMode, ReviewRating } from '@/types'
import { cn } from '@/lib/utils'

const studyModes: {
  mode: StudyMode
  label: string
  icon: typeof BookOpen
  description: string
}[] = [
  { mode: 'flip', label: 'Flashcards', icon: BookOpen, description: 'Classic flip card review' },
  { mode: 'typing', label: 'Typing', icon: PenLine, description: 'Type the meaning' },
  { mode: 'listening', label: 'Listening', icon: Headphones, description: 'Listen and recall' },
  { mode: 'fill-blank', label: 'Fill Blank', icon: PenLine, description: 'Complete sentences' },
]

export default function StudyPage() {
  const {
    isStudying,
    isFlipped,
    studyMode,
    currentCards,
    currentIndex,
    flipCard,
    rateCard,
    setStudyMode,
    startStudy,
    endStudy,
  } = useStudy()

  const { hydrated } = useVocabularyInit()
  const [showResult, setShowResult] = useState(false)

  const currentCard = currentCards[currentIndex]
  const progress = currentCards.length > 0 ? ((currentIndex + 1) / currentCards.length) * 100 : 0
  const sessionComplete =
    currentCards.length > 0 && !isStudying && currentIndex === currentCards.length - 1

  const handleRate = useCallback(
    (rating: ReviewRating) => {
      rateCard(rating)
      setShowResult(false)
    },
    [rateCard]
  )

  useStudyKeyboard({
    enabled: isStudying && !!currentCard,
    canFlip: studyMode === 'flip' && !showResult,
    canRate: isFlipped || showResult,
    onFlip: flipCard,
    onRate: handleRate,
  })

  const handleStartStudy = (mode: StudyMode) => {
    setStudyMode(mode)
    startStudy()
    setShowResult(false)
  }

  const handleModeResult = useCallback(() => {
    setShowResult(true)
  }, [])

  if (!hydrated) {
    return (
      <div className="min-h-screen pb-20 md:pb-0 md:pl-64">
        <StudySkeleton />
      </div>
    )
  }

  if (!isStudying) {
    return (
      <div className="min-h-screen pb-20 md:pb-0 md:pl-64">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Study Mode</h1>
            <p className="text-muted-foreground">Choose how you want to learn today</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {studyModes.map((item, index) => (
              <motion.button
                key={item.mode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleStartStudy(item.mode)}
                className={cn(
                  'flex flex-col items-start p-6 rounded-2xl border border-border',
                  'bg-card hover:bg-accent/50 transition-colors text-left',
                  'hover:shadow-md hover:border-primary/30'
                )}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-1">{item.label}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.button>
            ))}
          </div>

          <div className="mt-8 p-6 rounded-2xl bg-secondary/50 border border-border">
            <h2 className="font-semibold text-foreground mb-2">Keyboard Shortcuts</h2>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <p><kbd className="px-2 py-1 bg-background rounded text-xs">Space</kbd> Flip card</p>
              <p><kbd className="px-2 py-1 bg-background rounded text-xs">1</kbd> Again</p>
              <p><kbd className="px-2 py-1 bg-background rounded text-xs">2</kbd> Hard</p>
              <p><kbd className="px-2 py-1 bg-background rounded text-xs">3</kbd> Good</p>
              <p><kbd className="px-2 py-1 bg-background rounded text-xs">4</kbd> Easy</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pl-64">
      <div className="max-w-2xl mx-auto p-4 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={endStudy}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Exit
          </Button>
          <div className="text-sm text-muted-foreground" aria-live="polite">
            {currentIndex + 1} / {currentCards.length}
          </div>
          <Button variant="ghost" size="icon" aria-label="Shuffle cards">
            <Shuffle className="h-4 w-4" />
          </Button>
        </div>

        <Progress value={progress} className="h-2 mb-8" aria-label="Session progress" />

        <AnimatePresence mode="wait">
          {currentCard && !sessionComplete && (
            <motion.div
              key={`${currentCard.id}-${studyMode}-${currentIndex}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="mb-8"
            >
              {studyMode === 'flip' && (
                <Flashcard card={currentCard} isFlipped={isFlipped} onFlip={flipCard} />
              )}
              {studyMode === 'typing' && (
                <TypingMode card={currentCard} onResult={handleModeResult} />
              )}
              {studyMode === 'listening' && (
                <ListeningMode
                  card={currentCard}
                  isRevealed={isFlipped}
                  onReveal={flipCard}
                />
              )}
              {studyMode === 'fill-blank' && (
                <FillBlankMode card={currentCard} onResult={handleModeResult} />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {(isFlipped || showResult) && !sessionComplete && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <ReviewButtons onRate={handleRate} />
          </motion.div>
        )}

        {sessionComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-10 w-10 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Session Complete!</h2>
            <p className="text-muted-foreground mb-6">
              You reviewed {currentCards.length} cards
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={endStudy}>
                Back to Menu
              </Button>
              <Link href="/">
                <Button>Go to Dashboard</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
