import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { memoryStore } from '@/lib/memory-store'

// GET all chats
export async function GET(request: NextRequest) {
  const authError = await requireAuth(request)
  if (authError) return authError

  try {
    const chats = await memoryStore.getAllChats()
    return NextResponse.json({ chats })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('Error fetching chats:', errorMessage)
    return NextResponse.json(
      { error: 'Failed to fetch chats', details: errorMessage },
      { status: 500 }
    )
  }
}

// POST create new chat
export async function POST(request: NextRequest) {
  const authError = await requireAuth(request)
  if (authError) return authError

  try {
    const { title = 'New Chat' } = await request.json()

    const chat = await memoryStore.createChat(title)

    if (!chat || !chat.id) {
      throw new Error('Chat creation returned invalid data')
    }

    return NextResponse.json({ chat })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('Error creating chat:', errorMessage, error)
    return NextResponse.json(
      { error: 'Failed to create chat', details: errorMessage },
      { status: 500 }
    )
  }
}
