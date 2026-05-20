'use client'

import { useState, useCallback } from 'react'
import { Volume2 } from 'lucide-react'
import type { VocabularyCard } from '@/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { usePronunciation } from '@/hooks/use-pronunciation'

interface TypingModeProps {
  card: VocabularyCard
  onResult: (correct: boolean) => void
}

export function TypingMode({ card, onResult }: TypingModeProps) {
  const [input, setInput] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const { play } = usePronunciation()

  const check = useCallback(() => {
    const correct =
      input.toLowerCase().trim() === card.thaiMeaning.toLowerCase().trim() ||
      input.toLowerCase().trim() === card.word.toLowerCase().trim()
    setIsCorrect(correct)
    setShowResult(true)
    onResult(correct)
  }, [card, input, onResult])

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground text-sm mb-2">Translate this word:</p>
        <h2 className="text-4xl font-bold text-foreground mb-2">{card.word}</h2>
        <p className="text-muted-foreground font-mono">{card.ipa}</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => play(card.word, card.audioUrl)}>
          <Volume2 className="h-4 w-4 mr-2" />
          Listen
        </Button>
      </div>

      {!showResult ? (
        <div className="space-y-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && check()}
            placeholder="Type the Thai meaning..."
            className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus
            aria-label="Your answer"
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
          <p className="text-muted-foreground mt-2">
            Answer: <span className="font-medium text-foreground">{card.thaiMeaning}</span>
          </p>
        </div>
      )}
    </div>
  )
}
