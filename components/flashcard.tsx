'use client'

import { motion } from 'framer-motion'
import { Volume2 } from 'lucide-react'
import type { VocabularyCard } from '@/types'
import { cn, LEVEL_COLORS, TYPE_COLORS } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { usePronunciation } from '@/hooks/use-pronunciation'

interface FlashcardProps {
  card: VocabularyCard
  isFlipped: boolean
  onFlip: () => void
}

export function Flashcard({ card, isFlipped, onFlip }: FlashcardProps) {
  const { play } = usePronunciation()

  return (
    <div className="perspective-1000 w-full max-w-md mx-auto">
      <motion.div
        className="relative w-full aspect-[3/4] cursor-pointer"
        onClick={onFlip}
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
      >
        {/* Front of card */}
        <div
          className={cn(
            'absolute inset-0 rounded-2xl p-6 flex flex-col items-center justify-center',
            'bg-card border border-border shadow-lg',
            'backface-hidden'
          )}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', LEVEL_COLORS[card.level])}>
              {card.level}
            </span>
            <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', TYPE_COLORS[card.type])}>
              {card.type}
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-3 text-center">
            {card.word}
          </h2>

          <p className="text-muted-foreground text-lg mb-4 font-mono">{card.ipa}</p>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={(e) => {
              e.stopPropagation()
              play(card.word, card.audioUrl)
            }}
          >
            <Volume2 className="h-5 w-5" />
          </Button>

          <p className="text-sm text-muted-foreground mt-6">Tap to reveal answer</p>
        </div>

        {/* Back of card */}
        <div
          className={cn(
            'absolute inset-0 rounded-2xl p-6 flex flex-col',
            'bg-card border border-border shadow-lg',
            'backface-hidden overflow-y-auto'
          )}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="flex-1">
            <div className="text-center mb-6">
              <h3 className="text-3xl font-bold text-foreground mb-1">{card.thaiMeaning}</h3>
              <p className="text-muted-foreground text-sm">{card.thaiReading}</p>
            </div>

            <div className="space-y-4">
              <div className="bg-secondary/50 rounded-xl p-4">
                <p className="text-sm font-medium text-muted-foreground mb-1">Example</p>
                <p className="text-foreground">{card.example}</p>
                <p className="text-muted-foreground text-sm mt-1">{card.exampleThai}</p>
              </div>

              {card.synonyms.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Synonyms</p>
                  <div className="flex flex-wrap gap-2">
                    {card.synonyms.map((synonym) => (
                      <span
                        key={synonym}
                        className="px-2 py-1 bg-secondary rounded-lg text-sm text-secondary-foreground"
                      >
                        {synonym}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-primary/10 rounded-lg text-xs text-primary"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground text-center mt-4">Tap to flip back</p>
        </div>
      </motion.div>
    </div>
  )
}
