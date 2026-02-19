// In-memory storage for chats (no database needed)
// Perfect for ephemeral Render deployments

interface StoredMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: string
}

interface StoredChat {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  messages: StoredMessage[]
}

// In-memory store
const chatsStore = new Map<string, StoredChat>()
const messagesStore = new Map<string, StoredMessage>()

function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export const memoryStore = {
  // Chats
  async createChat(title: string): Promise<StoredChat> {
    const id = generateId()
    const now = new Date().toISOString()
    const chat: StoredChat = {
      id,
      title,
      createdAt: now,
      updatedAt: now,
      messages: [],
    }
    chatsStore.set(id, chat)
    return chat
  },

  async getChat(id: string): Promise<StoredChat | null> {
    return chatsStore.get(id) || null
  },

  async getChatWithMessages(id: string): Promise<StoredChat | null> {
    const chat = chatsStore.get(id)
    if (!chat) return null
    return {
      ...chat,
      messages: Array.from(messagesStore.values()).filter(m => m.id.startsWith(id)),
    }
  },

  async getAllChats(): Promise<StoredChat[]> {
    return Array.from(chatsStore.values()).sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  },

  async updateChatTitle(id: string, title: string): Promise<StoredChat | null> {
    const chat = chatsStore.get(id)
    if (!chat) return null
    chat.title = title
    chat.updatedAt = new Date().toISOString()
    chatsStore.set(id, chat)
    return chat
  },

  async deleteChat(id: string): Promise<void> {
    chatsStore.delete(id)
    // Delete associated messages
    const toDelete = Array.from(messagesStore.keys()).filter(k => k.startsWith(id))
    toDelete.forEach(k => messagesStore.delete(k))
  },

  // Messages
  async addMessage(
    chatId: string,
    role: 'user' | 'assistant' | 'system',
    content: string
  ): Promise<StoredMessage> {
    const id = `${chatId}-${generateId()}`
    const message: StoredMessage = {
      id,
      role,
      content,
      createdAt: new Date().toISOString(),
    }
    messagesStore.set(id, message)

    // Update chat's updatedAt timestamp
    const chat = chatsStore.get(chatId)
    if (chat) {
      chat.updatedAt = new Date().toISOString()
      chatsStore.set(chatId, chat)
    }

    return message
  },

  async getChatMessages(chatId: string): Promise<StoredMessage[]> {
    return Array.from(messagesStore.values())
      .filter(m => m.id.startsWith(chatId))
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  },
}
