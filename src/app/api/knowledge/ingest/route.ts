import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { ingestDefaultKnowledge } from '@/lib/knowledge'

export async function POST(request: NextRequest) {
  const authError = await requireAuth(request)
  if (authError) return authError

  try {
    await ingestDefaultKnowledge()
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error ingesting knowledge:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to ingest knowledge' },
      { status: 500 }
    )
  }
}
