import { NextResponse } from 'next/server'
import { vocabularyService } from '@/services/vocabulary.service'

export async function POST() {
  try {
    const count = await vocabularyService.seedIfEmpty()
    return NextResponse.json({ seeded: count, message: `Database has ${count} vocabulary entries` })
  } catch (error) {
    console.error('[POST /api/vocabulary/seed]', error)
    return NextResponse.json({ error: 'Seed failed' }, { status: 500 })
  }
}
