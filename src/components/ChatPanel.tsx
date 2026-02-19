'use client'

import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import styles from './ChatPanel.module.css'
import { Chat, Message } from './ChatInterface'

interface ChatPanelProps {
  chat: Chat | null
  onChatUpdate: () => void
  onNewChat: () => void
}

export default function ChatPanel({ chat, onChatUpdate, onNewChat }: ChatPanelProps) {
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState('')
  const [strategyMode, setStrategyMode] = useState(true)
  const [useKnowledge, setUseKnowledge] = useState(true)
  const [responseStyle, setResponseStyle] = useState<'concise' | 'standard' | 'deep'>('standard')
  const [abortController, setAbortController] = useState<AbortController | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [chat?.messages, streamingMessage])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async () => {
    if (!input.trim() || streaming) return

    const userMessage = input.trim()
    setInput('')

    // Create chat if none exists
    let chatId = chat?.id
    if (!chatId) {
      onNewChat()
      // Wait a bit for the chat to be created
      await new Promise(resolve => setTimeout(resolve, 500))
      return
    }

    // Check if this is the first message before sending
    const isFirstMessage = !chat?.messages || chat.messages.length === 0

    try {
      setStreaming(true)
      setStreamingMessage('')

      const controller = new AbortController()
      setAbortController(controller)

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId,
          message: userMessage,
          strategyMode,
          useKnowledge,
          responseStyle,
        }),
        signal: controller.signal,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || errorData.error || `API error: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error('No reader available')

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              setStreaming(false)
              
              // Generate title for first message, then update UI
              if (isFirstMessage) {
                await generateTitle(chatId, userMessage)
              } else {
                await onChatUpdate()
              }
              
              // Clear streaming message AFTER messages have been reloaded
              setStreamingMessage('')
              break
            }

            try {
              const parsed = JSON.parse(data)
              if (parsed.content) {
                setStreamingMessage(prev => prev + parsed.content)
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        const errorMsg = error instanceof Error ? error.message : String(error)
        console.error('Error sending message:', errorMsg)
        alert(`Failed to send message: ${errorMsg}`)
      }
      setStreaming(false)
      setStreamingMessage('')
    } finally {
      setAbortController(null)
    }
  }

  const handleStop = () => {
    if (abortController) {
      abortController.abort()
      setAbortController(null)
      setStreaming(false)
      setStreamingMessage('')
    }
  }

  const generateTitle = async (chatId: string, firstMessage: string) => {
    try {
      const response = await fetch(`/api/chats/${chatId}/title`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstMessage }),
      })
      const data = await response.json()
      if (data.title) {
        // Title is now saved in database, trigger UI update
        onChatUpdate()
      }
    } catch (error) {
      console.error('Failed to generate title:', error)
    }
  }

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!chat) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyContent}>
          <h2>Welcome to NPI Strategy Analyst</h2>
          <p>Start a new chat to begin strategizing for Vision 2030</p>
          <button onClick={onNewChat} className={styles.startBtn}>
            Start New Chat
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.chatPanel}>
      <div className={styles.messages}>
        {chat.messages?.map((message) => (
          <div key={message.id} className={`${styles.message} ${styles[message.role]}`}>
            <div className={styles.messageContent}>
              {message.role === 'assistant' ? (
                <ReactMarkdown>{message.content}</ReactMarkdown>
              ) : (
                <p>{message.content}</p>
              )}
            </div>
            <button
              className={styles.copyBtn}
              onClick={() => handleCopy(message.content)}
              title="Copy"
            >
              Copy
            </button>
          </div>
        ))}

        {streaming && streamingMessage && (
          <div className={`${styles.message} ${styles.assistant} ${styles.streaming}`}>
            <div className={styles.messageContent}>
              <ReactMarkdown>{streamingMessage}</ReactMarkdown>
            </div>
          </div>
        )}

        {streaming && !streamingMessage && (
          <div className={`${styles.message} ${styles.assistant}`}>
            <div className={styles.typingIndicator}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputArea}>
        <div className={styles.inputRow}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Shift+Enter for new line)"
            rows={3}
            disabled={streaming}
          />
          {streaming ? (
            <button onClick={handleStop} className={styles.stopBtn}>
              Stop
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className={styles.sendBtn}
            >
              Send
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
