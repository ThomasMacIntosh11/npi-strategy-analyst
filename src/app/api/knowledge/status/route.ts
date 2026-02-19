import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const authError = await requireAuth(request)
  if (authError) return authError

  try {
    const sources = await prisma.knowledgeSource.findMany({
      include: {
        _count: {
          select: { chunks: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    const totalChunks = await prisma.knowledgeChunk.count()

    return NextResponse.json({
      sources: sources.map(s => ({
        name: s.name,
        version: s.version,
        updatedAt: s.updatedAt,
        chunkCount: s._count.chunks
      })),
      totalChunks
    })
  } catch (error) {
    console.error('Error fetching knowledge status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch knowledge status' },
      { status: 500 }
    )
  }
}
