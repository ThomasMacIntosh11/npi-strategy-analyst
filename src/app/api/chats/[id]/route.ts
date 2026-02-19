import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'

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
    const chat = await prisma.chat.findUnique({
      where: { id, deletedAt: null },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!chat) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ chat })
  } catch (error) {
    console.error('Error fetching chat:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chat' },
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

    const chat = await prisma.chat.update({
      where: { id },
      data: { title }
    })

    return NextResponse.json({ chat })
  } catch (error) {
    console.error('Error updating chat:', error)
    return NextResponse.json(
      { error: 'Failed to update chat' },
      { status: 500 }
    )
  }
}

// DELETE chat (soft delete)
export async function DELETE(request: NextRequest, { params }: Params) {
  const authError = await requireAuth(request)
  if (authError) return authError

  try {
    const { id } = await params
    await prisma.chat.update({
      where: { id },
      data: { deletedAt: new Date() }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting chat:', error)
    return NextResponse.json(
      { error: 'Failed to delete chat' },
      { status: 500 }
    )
  }
}
