import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { memoryStore } from '@/lib/memory-store'

interface Params {
  params: Promise<{
    id: string
  }>
}

// GET single chat with messages
export async function GET(request: NextRequest, { params }: Params) {
  const authError = await requireAuth(request)
  if (authError) return authError

  try {
    const { id } = await params
    const chat = await memoryStore.getChatWithMessages(id)

    if (!chat) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ chat })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('Error fetching chat:', errorMessage)
    return NextResponse.json(
      { error: 'Failed to fetch chat', details: errorMessage },
      { status: 500 }
    )
  }
}

// PATCH update chat (rename)
export async function PATCH(request: NextRequest, { params }: Params) {
  const authError = await requireAuth(request)
  if (authError) return authError

  try {
    const { id } = await params
    const { title } = await request.json()

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const chat = await memoryStore.updateChatTitle(id, title)

    if (!chat) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ chat })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('Error updating chat:', errorMessage)
    return NextResponse.json(
      { error: 'Failed to update chat', details: errorMessage },
      { status: 500 }
    )
  }
}

// DELETE chat
export async function DELETE(request: NextRequest, { params }: Params) {
  const authError = await requireAuth(request)
  if (authError) return authError

  try {
    const { id } = await params
    await memoryStore.deleteChat(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('Error deleting chat:', errorMessage)
    return NextResponse.json(
      { error: 'Failed to delete chat', details: errorMessage },
      { status: 500 }
    )
  }
}
