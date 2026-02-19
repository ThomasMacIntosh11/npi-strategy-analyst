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
      const data = await response.json()
      setChats(data.chats || [])
    } catch (error) {
      console.error('Failed to load chats:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadChat = async (chatId: string) => {
    try {
      const response = await fetch(`/api/chats/${chatId}`)
      const data = await response.json()
      setCurrentChat(data.chat)
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
      const data = await response.json()
      const newChat = data.chat
      setChats([newChat, ...chats])
      setCurrentChatId(newChat.id)
    } catch (error) {
      console.error('Failed to create chat:', error)
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
