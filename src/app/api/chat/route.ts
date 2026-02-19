import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { memoryStore } from '@/lib/memory-store'
import { openai, OPENAI_MODEL } from '@/lib/openai'
import { buildSystemMessage } from '@/lib/prompts'
import { retrieveRelevantChunks } from '@/lib/knowledge'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const authError = await requireAuth(request)
  if (authError) return authError

  try {
    const body = await request.json()
    const { 
      chatId, 
      message, 
      strategyMode = true, 
      useKnowledge = true,
      responseStyle = 'standard'
    } = body

    if (!chatId || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Save user message
    await memoryStore.addMessage(chatId, 'user', message)

    // Retrieve relevant knowledge if enabled
    let knowledgeContext = ''
    if (useKnowledge) {
      const relevantChunks = await retrieveRelevantChunks(message, 5)
      if (relevantChunks.length > 0) {
        knowledgeContext = relevantChunks
          .map((chunk, idx) => 
            `[Excerpt ${idx + 1} - Source: ${chunk.sourceName}]\n${chunk.content}`
          )
          .join('\n\n---\n\n')
      }
    }

    // Build messages array
    const allMessages = await memoryStore.getChatMessages(chatId)

    const systemMessage = buildSystemMessage(
      useKnowledge,
      knowledgeContext,
      strategyMode,
      responseStyle as 'concise' | 'standard' | 'deep'
    )

    const chatMessages = [
      { role: 'system' as const, content: systemMessage },
      ...allMessages.map(m => ({
        role: m.role as 'user' | 'assistant' | 'system',
        content: m.content
      }))
    ]

    // Create streaming response
    const stream = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: chatMessages,
      stream: true,
      temperature: 0.7,
      max_tokens: responseStyle === 'deep' ? 2000 : responseStyle === 'concise' ? 500 : 1000,
    })

    // Create a ReadableStream to send to client
    const encoder = new TextEncoder()
    let fullResponse = ''

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || ''
            if (content) {
              fullResponse += content
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
            }
          }

          // Save assistant message
          await memoryStore.addMessage(chatId, 'assistant', fullResponse)

          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          console.error('Streaming error:', error)
          controller.error(error)
        }
      }
    })

    return new NextResponse(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('Chat API error:', errorMessage)
    return NextResponse.json(
      { error: 'Failed to process message', details: errorMessage },
      { status: 500 }
    )
  }
}
