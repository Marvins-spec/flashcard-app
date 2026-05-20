import { NextResponse } from 'next/server'
import { z } from 'zod'
import { vocabularyService } from '@/services/vocabulary.service'

const reviewSchema = z.object({
  cardId: z.string(),
  rating: z.enum(['again', 'hard', 'good', 'easy']),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { cardId, rating } = reviewSchema.parse(body)
    const cards = await vocabularyService.getAll()
    const card = cards.find((c) => c.id === cardId)
    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 })
    }
    const updated = await vocabularyService.rateCard(card, rating)
    return NextResponse.json({ data: updated })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 })
    }
    console.error('[POST /api/reviews]', error)
    return NextResponse.json({ error: 'Review failed' }, { status: 500 })
  }
}
