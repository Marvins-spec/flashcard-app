'use client'

import { Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { usePronunciation } from '@/hooks/use-pronunciation'

interface AudioButtonProps {
  word: string
  audioUrl?: string
  className?: string
  size?: 'sm' | 'default' | 'lg' | 'icon'
}

export function AudioButton({ word, audioUrl, className, size = 'icon' }: AudioButtonProps) {
  const { play } = usePronunciation()

  return (
    <Button
      variant="outline"
      size={size}
      className={cn('rounded-full', className)}
      onClick={(e) => {
        e.stopPropagation()
        play(word, audioUrl)
      }}
      aria-label={`Play pronunciation of ${word}`}
    >
      <Volume2 className={cn(size === 'sm' ? 'h-4 w-4' : 'h-5 w-5')} />
    </Button>
  )
}
