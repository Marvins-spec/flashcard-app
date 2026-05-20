'use client'

import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Volume2, BookOpen, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { vocabularyData } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function WordDetailPage() {
  const params = useParams()
  const router = useRouter()
  const word = vocabularyData.find((w) => w.id === params.id)

  if (!word) {
    return (
      <div className="min-h-screen pb-24 md:pb-8 md:pl-64 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Word not found</h1>
          <p className="text-muted-foreground mb-4">The word you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/words">
            <Button>Back to Words</Button>
          </Link>
        </div>
      </div>
    )
  }

  const playAudio = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(word.word)
      utterance.lang = 'en-US'
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const levelColors: Record<string, string> = {
    A1: 'bg-accent/20 text-accent-foreground',
    A2: 'bg-accent/30 text-accent-foreground',
    B1: 'bg-primary/20 text-primary',
    B2: 'bg-primary/30 text-primary',
    C1: 'bg-chart-4/20 text-chart-4',
    C2: 'bg-chart-4/30 text-chart-4',
  }

  const typeColors: Record<string, string> = {
    noun: 'bg-chart-2/20 text-chart-2',
    verb: 'bg-chart-1/20 text-chart-1',
    adjective: 'bg-chart-3/20 text-chart-3',
    adverb: 'bg-chart-4/20 text-chart-4',
    preposition: 'bg-chart-5/20 text-chart-5',
    conjunction: 'bg-muted text-muted-foreground',
    pronoun: 'bg-accent/20 text-accent',
    determiner: 'bg-secondary text-secondary-foreground',
    exclamation: 'bg-destructive/20 text-destructive',
  }

  return (
    <div className="min-h-screen pb-24 md:pb-8 md:pl-64">
      <div className="max-w-3xl mx-auto p-4 md:p-8">
        {/* Back button */}
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-6 md:p-8 mb-6"
        >
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={cn('px-3 py-1 rounded-full text-sm font-medium', levelColors[word.level])}>
              {word.level}
            </span>
            <span className={cn('px-3 py-1 rounded-full text-sm font-medium capitalize', typeColors[word.type])}>
              {word.type}
            </span>
          </div>

          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">{word.word}</h1>
              <p className="text-xl text-muted-foreground font-mono">{word.ipa}</p>
            </div>
            <Button size="lg" variant="outline" className="rounded-full" onClick={playAudio}>
              <Volume2 className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Thai Meaning */}
            <div className="p-4 rounded-xl bg-secondary/50">
              <p className="text-sm font-medium text-muted-foreground mb-1">Thai Meaning</p>
              <p className="text-2xl font-semibold text-foreground">{word.thaiMeaning}</p>
              <p className="text-muted-foreground mt-1">{word.thaiReading}</p>
            </div>

            {/* Example */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Example Sentence</p>
              <div className="p-4 rounded-xl border border-border bg-background">
                <p className="text-lg text-foreground mb-2">{word.example}</p>
                <p className="text-muted-foreground">{word.exampleThai}</p>
              </div>
            </div>

            {/* Synonyms */}
            {word.synonyms.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Synonyms</p>
                <div className="flex flex-wrap gap-2">
                  {word.synonyms.map((synonym) => (
                    <span
                      key={synonym}
                      className="px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground font-medium"
                    >
                      {synonym}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {word.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/words?tag=${tag}`}
                    className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-3"
        >
          <Link href="/study" className="flex-1">
            <Button className="w-full" size="lg">
              <BookOpen className="h-4 w-4 mr-2" />
              Practice this word
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              window.open(
                `https://www.oxfordlearnersdictionaries.com/definition/english/${word.word}`,
                '_blank'
              )
            }}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Oxford Dictionary
          </Button>
        </motion.div>

        {/* Related Words */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <h2 className="font-semibold text-foreground mb-4">Related Words</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {vocabularyData
              .filter(
                (w) =>
                  w.id !== word.id &&
                  (w.tags.some((t) => word.tags.includes(t)) || w.type === word.type)
              )
              .slice(0, 4)
              .map((relatedWord) => (
                <Link
                  key={relatedWord.id}
                  href={`/words/${relatedWord.id}`}
                  className="p-4 rounded-xl border border-border bg-card hover:bg-secondary/50 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {relatedWord.word}
                      </p>
                      <p className="text-sm text-muted-foreground">{relatedWord.thaiMeaning}</p>
                    </div>
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', levelColors[relatedWord.level])}>
                      {relatedWord.level}
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
