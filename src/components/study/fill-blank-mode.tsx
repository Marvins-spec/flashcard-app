'use client'

import { useState, useCallback } from 'react'
import type { VocabularyCard } from '@/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FillBlankModeProps {
  card: VocabularyCard
  onResult: (correct: boolean) => void
}

export function FillBlankMode({ card, onResult }: FillBlankModeProps) {
  const [input, setInput] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const check = useCallback(() => {
    const correct = input.toLowerCase().trim() === card.word.toLowerCase().trim()
    setIsCorrect(correct)
    setShowResult(true)
    onResult(correct)
  }, [card.word, input, onResult])

  const maskedExample = card.example.replace(
    new RegExp(card.word, 'gi'),
    showResult ? card.word : '_____'
  )

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-8">
        <p className="text-muted-foreground text-sm mb-4">Complete the sentence:</p>
        <p className="text-xl text-foreground leading-relaxed">{maskedExample}</p>
        {showResult && (
          <p className="text-muted-foreground mt-4">{card.exampleThai}</p>
        )}
      </div>

      {!showResult ? (
        <div className="space-y-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && check()}
            placeholder="Type the missing word..."
            className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus
            aria-label="Missing word"
          />
          <Button onClick={check} className="w-full">
            Check Answer
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            'rounded-xl p-4 text-center',
            isCorrect ? 'bg-success/10 border border-success/30' : 'bg-destructive/10 border border-destructive/30'
          )}
          role="status"
        >
          <p className={cn('font-semibold', isCorrect ? 'text-success' : 'text-destructive')}>
            {isCorrect ? 'Correct!' : 'Incorrect'}
          </p>
          {!isCorrect && (
            <p className="text-muted-foreground mt-2">
              Answer: <span className="font-medium text-foreground">{card.word}</span>
            </p>
          )}
        </div>
      )}
    </div>
  )
}
