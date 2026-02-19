import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { knowledgeStore } from '@/lib/knowledge-store'

export async function GET(request: NextRequest) {
  const authError = await requireAuth(request)
  if (authError) return authError

  try {
    const stats = knowledgeStore.getStats()
    const chunks = await knowledgeStore.getAllChunks()
    
    // Group chunks by source
    const sourceMap = new Map<string, { name: string; chunkCount: number; updatedAt: Date }>()
    for (const chunk of chunks) {
      if (!sourceMap.has(chunk.sourceName)) {
        sourceMap.set(chunk.sourceName, {
          name: chunk.sourceName,
          chunkCount: 0,
          updatedAt: chunk.createdAt
        })
      }
      const source = sourceMap.get(chunk.sourceName)!
      source.chunkCount++
    }

    const sources = Array.from(sourceMap.values())

    return NextResponse.json({
      sources,
      totalChunks: chunks.length
    })
  } catch (error) {
    console.error('Error fetching knowledge status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch knowledge status' },
      { status: 500 }
    )
  }
}
