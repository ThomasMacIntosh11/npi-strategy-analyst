'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './Sidebar.module.css'
import { Chat } from './ChatInterface'

interface SidebarProps {
  chats: Chat[]
  currentChatId: string | null
  onSelectChat: (id: string) => void
  onNewChat: () => void
  onDeleteChat: (id: string) => void
  onRenameChat: (id: string, title: string) => void
}

export default function Sidebar({
  chats,
  currentChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onRenameChat,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const router = useRouter()

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleRename = (chat: Chat) => {
    setEditingId(chat.id)
    setEditTitle(chat.title)
  }

  const handleSaveRename = (chatId: string) => {
    if (editTitle.trim()) {
      onRenameChat(chatId, editTitle.trim())
    }
    setEditingId(null)
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h2>NPI Strategy Analyst</h2>
        <button onClick={onNewChat} className={styles.newChatBtn}>
          + New Chat
        </button>
      </div>

      <div className={styles.search}>
        <input
          type="text"
          placeholder="Search chats..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className={styles.chatList}>
        {filteredChats.map(chat => (
          <div
            key={chat.id}
            className={`${styles.chatItem} ${chat.id === currentChatId ? styles.active : ''}`}
          >
            {editingId === chat.id ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={() => handleSaveRename(chat.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveRename(chat.id)
                  if (e.key === 'Escape') setEditingId(null)
                }}
                autoFocus
                className={styles.editInput}
              />
            ) : (
              <>
                <div
                  className={styles.chatTitle}
                  onClick={() => onSelectChat(chat.id)}
                >
                  {chat.title}
                </div>
                <div className={styles.chatActions}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRename(chat)
                    }}
                    title="Rename"
                    className={styles.actionBtn}
                  >
                    ✎
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm('Delete this chat?')) {
                        onDeleteChat(chat.id)
                      }
                    }}
                    title="Delete"
                    className={styles.actionBtn}
                  >
                    ×
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <button onClick={handleLogout} className={styles.linkBtn}>
          Logout
        </button>
      </div>
    </div>
  )
}
