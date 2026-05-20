'use client'

import { Volume2 } from 'lucide-react'
import type { VocabularyCard } from '@/types'
import { Button } from '@/components/ui/button'
import { usePronunciation } from '@/hooks/use-pronunciation'

interface ListeningModeProps {
  card: VocabularyCard
  isRevealed: boolean
  onReveal: () => void
}

export function ListeningMode({ card, isRevealed, onReveal }: ListeningModeProps) {
  const { play, isPlaying } = usePronunciation()

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground text-sm mb-6">Listen and identify the word:</p>
        <Button
          size="lg"
          onClick={() => play(card.word, card.audioUrl)}
          className="rounded-full w-20 h-20"
          aria-label={`Play pronunciation of ${card.word}`}
        >
          <Volume2 className="h-8 w-8" />
        </Button>
        <p className="text-sm text-muted-foreground mt-4">
          {isPlaying ? 'Playing...' : 'Click to play audio'}
        </p>
      </div>

      {!isRevealed ? (
        <Button onClick={onReveal} variant="outline" className="w-full">
          Reveal Answer
        </Button>
      ) : (
        <div className="rounded-xl border border-border bg-card p-6 text-center">
          <h3 className="text-3xl font-bold text-foreground mb-2">{card.word}</h3>
          <p className="text-xl text-muted-foreground">{card.thaiMeaning}</p>
        </div>
      )}
    </div>
  )
}
