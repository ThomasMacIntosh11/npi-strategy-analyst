import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { openai, OPENAI_MODEL } from '@/lib/openai'
import { prisma } from '@/lib/prisma'

interface Params {
  params: Promise<{
    id: string
  }>
}

// POST generate title for chat
export async function POST(request: NextRequest, { params }: Params) {
  const authError = await requireAuth(request)
  if (authError) return authError

  try {
    const { id } = await params
    const { firstMessage } = await request.json()

    if (!firstMessage) {
      return NextResponse.json(
        { error: 'First message is required' },
        { status: 400 }
      )
    }

    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        {
          role: 'system',
          content: 'Generate a concise 4-7 word title for this chat based on the user\'s first message. Return only the title, no quotes or punctuation.'
        },
        {
          role: 'user',
          content: firstMessage
        }
      ],
      temperature: 0.7,
      max_tokens: 20,
    })

    const title = response.choices[0]?.message?.content?.trim() || 'New Chat'

    // Update the chat with the generated title
    await prisma.chat.update({
      where: { id },
      data: { title }
    })

    return NextResponse.json({ title })
  } catch (error) {
    console.error('Error generating title:', error)
    return NextResponse.json(
      { error: 'Failed to generate title' },
      { status: 500 }
    )
  }
}
