'use client'

import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import ChatPanel from './ChatPanel'
import styles from './ChatInterface.module.css'
import { BrowserStorage } from '@/lib/browser-storage'

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
    BrowserStorage.init()
    loadChats()
  }, [])

  useEffect(() => {
    if (currentChatId) {
      loadChat(currentChatId)
    }
  }, [currentChatId])

  const loadChats = async () => {
    try {
      // Load from localStorage first for instant display
      const storedChatIds = BrowserStorage.getAllChatIds()
      const storedChats = storedChatIds
        .map(id => BrowserStorage.getChat(id))
        .filter((chat): chat is Chat => chat !== null)
      
      if (storedChats.length > 0) {
        setChats(storedChats)
      }

      // Then fetch latest from server and update
      const response = await fetch('/api/chats')
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.details || 'Failed to load chats')
      }
      const data = await response.json()
      if (Array.isArray(data.chats)) {
        setChats(data.chats)
        // Cache in localStorage
        data.chats.forEach((chat: Chat) => BrowserStorage.saveChat(chat))
      } else {
        console.warn('Invalid chats response format:', data)
        if (storedChats.length === 0) {
          setChats([])
        }
      }
    } catch (error) {
      console.error('Failed to load chats:', error)
      if (chats.length === 0) {
        alert(`Failed to load chats: ${error instanceof Error ? error.message : String(error)}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const loadChat = async (chatId: string) => {
    try {
      // Load from localStorage first
      const stored = BrowserStorage.getChat(chatId)
      if (stored) {
        setCurrentChat(stored)
      }

      // Then fetch latest from server
      const response = await fetch(`/api/chats/${chatId}`)
      if (!response.ok) {
        throw new Error('Failed to load chat')
      }
      const data = await response.json()
      if (data.chat && data.chat.id) {
        setCurrentChat(data.chat)
        BrowserStorage.saveChat(data.chat)
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
        BrowserStorage.saveChat(newChat)
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
      BrowserStorage.deleteChat(chatId)
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
      const updatedChats = chats.map(c => c.id === chatId ? { ...c, title: newTitle } : c)
      setChats(updatedChats)
      const updated = updatedChats.find(c => c.id === chatId)
      if (updated) BrowserStorage.saveChat(updated)
      if (currentChat?.id === chatId) {
        const newChat = { ...currentChat, title: newTitle }
        setCurrentChat(newChat)
        BrowserStorage.saveChat(newChat)
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
        onChatUpdate={async () => {
          await loadChats()
          if (currentChatId) await loadChat(currentChatId)
        }}
        onNewChat={handleNewChat}
      />
    </div>
  )
}
