import { NextResponse } from 'next/server'
import { vocabularyService } from '@/services/vocabulary.service'

export async function GET() {
  try {
    await vocabularyService.seedIfEmpty()
    const cards = await vocabularyService.getAll()
    return NextResponse.json({ data: cards, count: cards.length })
  } catch (error) {
    console.error('[GET /api/vocabulary]', error)
    return NextResponse.json(
      { error: 'Failed to load vocabulary' },
      { status: 500 }
    )
  }
}
