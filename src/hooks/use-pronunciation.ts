'use client'

import { useCallback, useRef, useState } from 'react'
import { useStudyStore } from '@/store/study-store'

export function usePronunciation() {
  const audioEnabled = useStudyStore((s) => s.settings.audioEnabled)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const play = useCallback(
    (word: string, audioUrl?: string) => {
      if (!audioEnabled) return

      if (audioUrl) {
        if (audioRef.current) {
          audioRef.current.pause()
        }
        const audio = new Audio(audioUrl)
        audioRef.current = audio
        setIsPlaying(true)
        audio.play().finally(() => setIsPlaying(false))
        audio.onended = () => setIsPlaying(false)
        return
      }

      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(word)
        utterance.lang = 'en-US'
        utterance.rate = 0.85
        utterance.pitch = 1
        setIsPlaying(true)
        utterance.onend = () => setIsPlaying(false)
        window.speechSynthesis.speak(utterance)
      }
    },
    [audioEnabled]
  )

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setIsPlaying(false)
  }, [])

  return { play, stop, isPlaying, audioEnabled }
}
