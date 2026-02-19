'use client'

import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import ChatPanel from './ChatPanel'
import styles from './ChatInterface.module.css'

export interface Chat {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  messages?: Message[]
}

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: string
}

export default function ChatInterface() {
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [currentChat, setCurrentChat] = useState<Chat | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadChats()
  }, [])

  useEffect(() => {
    if (currentChatId) {
      loadChat(currentChatId)
    }
  }, [currentChatId])

  const loadChats = async () => {
    try {
      const response = await fetch('/api/chats')
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.details || 'Failed to load chats')
      }
      const data = await response.json()
      if (Array.isArray(data.chats)) {
        setChats(data.chats)
      } else {
        console.warn('Invalid chats response format:', data)
        setChats([])
      }
    } catch (error) {
      console.error('Failed to load chats:', error)
      alert(`Failed to load chats: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setLoading(false)
    }
  }

  const loadChat = async (chatId: string) => {
    try {
      const response = await fetch(`/api/chats/${chatId}`)
      if (!response.ok) {
        throw new Error('Failed to load chat')
      }
      const data = await response.json()
      if (data.chat && data.chat.id) {
        setCurrentChat(data.chat)
      } else {
        throw new Error('Invalid chat response')
      }
    } catch (error) {
      console.error('Failed to load chat:', error)
    }
  }

  const handleNewChat = async () => {
    try {
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Chat' }),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.details || 'Failed to create chat')
      }
      const data = await response.json()
      const newChat = data.chat
      if (newChat && newChat.id) {
        setChats([newChat, ...chats])
        setCurrentChatId(newChat.id)
      } else {
        throw new Error('Invalid chat response from server')
      }
    } catch (error) {
      console.error('Failed to create chat:', error)
      alert(`Failed to create chat: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  const handleDeleteChat = async (chatId: string) => {
    try {
      await fetch(`/api/chats/${chatId}`, { method: 'DELETE' })
      setChats(chats.filter(c => c.id !== chatId))
      if (currentChatId === chatId) {
        setCurrentChatId(null)
        setCurrentChat(null)
      }
    } catch (error) {
      console.error('Failed to delete chat:', error)
    }
  }

  const handleRenameChat = async (chatId: string, newTitle: string) => {
    try {
      await fetch(`/api/chats/${chatId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      })
      setChats(chats.map(c => c.id === chatId ? { ...c, title: newTitle } : c))
      if (currentChat?.id === chatId) {
        setCurrentChat({ ...currentChat, title: newTitle })
      }
    } catch (error) {
      console.error('Failed to rename chat:', error)
    }
  }

  return (
    <div className={styles.container}>
      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={setCurrentChatId}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
      />
      <ChatPanel
        chat={currentChat}
        onChatUpdate={() => {
          loadChats()
          if (currentChatId) loadChat(currentChatId)
        }}
        onNewChat={handleNewChat}
      />
    </div>
  )
}
