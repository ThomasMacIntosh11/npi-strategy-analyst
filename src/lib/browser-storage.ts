// Browser-side persistent storage using localStorage
// This keeps chats persistent per-browser without needing a database server

import { Chat, Message } from '@/components/ChatInterface'

const STORAGE_KEY_PREFIX = 'npi-strategy-chats-'
const CHATS_INDEX_KEY = 'npi-strategy-chats-index'

export const BrowserStorage = {
  // Initialize storage for current session
  init: () => {
    if (typeof window === 'undefined') return

    // Ensure index exists
    if (!localStorage.getItem(CHATS_INDEX_KEY)) {
      localStorage.setItem(CHATS_INDEX_KEY, JSON.stringify([]))
    }
  },

  // Get all chat IDs for this browser
  getAllChatIds: (): string[] => {
    if (typeof window === 'undefined') return []
    const index = localStorage.getItem(CHATS_INDEX_KEY)
    return index ? JSON.parse(index) : []
  },

  // Get a specific chat with messages
  getChat: (chatId: string): Chat | null => {
    if (typeof window === 'undefined') return null
    const key = `${STORAGE_KEY_PREFIX}${chatId}`
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  },

  // Save a chat (creates or updates)
  saveChat: (chat: Chat): void => {
    if (typeof window === 'undefined') return

    const key = `${STORAGE_KEY_PREFIX}${chat.id}`
    localStorage.setItem(key, JSON.stringify(chat))

    // Update index if new chat
    const index = BrowserStorage.getAllChatIds()
    if (!index.includes(chat.id)) {
      index.push(chat.id)
      localStorage.setItem(CHATS_INDEX_KEY, JSON.stringify(index))
    }
  },

  // Delete a chat
  deleteChat: (chatId: string): void => {
    if (typeof window === 'undefined') return

    const key = `${STORAGE_KEY_PREFIX}${chatId}`
    localStorage.removeItem(key)

    const index = BrowserStorage.getAllChatIds()
    const newIndex = index.filter(id => id !== chatId)
    localStorage.setItem(CHATS_INDEX_KEY, JSON.stringify(newIndex))
  },

  // Clear all chats in this browser
  clearAllChats: (): void => {
    if (typeof window === 'undefined') return

    const index = BrowserStorage.getAllChatIds()
    index.forEach(chatId => {
      const key = `${STORAGE_KEY_PREFIX}${chatId}`
      localStorage.removeItem(key)
    })
    localStorage.removeItem(CHATS_INDEX_KEY)
  },

  // Get storage size in bytes
  getStorageSize: (): number => {
    if (typeof window === 'undefined') return 0

    let size = 0
    for (let key in localStorage) {
      if (key.startsWith(STORAGE_KEY_PREFIX) || key === CHATS_INDEX_KEY) {
        size += localStorage[key].length + key.length
      }
    }
    return size
  }
}
