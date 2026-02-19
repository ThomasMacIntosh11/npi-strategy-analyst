'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './KnowledgeManager.module.css'

interface KnowledgeSource {
  name: string
  version: string
  updatedAt: string
  chunkCount: number
}

export default function KnowledgeManager() {
  const [sources, setSources] = useState<KnowledgeSource[]>([])
  const [totalChunks, setTotalChunks] = useState(0)
  const [loading, setLoading] = useState(true)
  const [ingesting, setIngesting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadStatus()
  }, [])

  const loadStatus = async () => {
    try {
      const response = await fetch('/api/knowledge/status')
      const data = await response.json()
      setSources(data.sources || [])
      setTotalChunks(data.totalChunks || 0)
    } catch (error) {
      console.error('Failed to load knowledge status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleIngest = async () => {
    if (!confirm('Re-ingest knowledge sources? This will replace existing data.')) {
      return
    }

    setIngesting(true)
    try {
      const response = await fetch('/api/knowledge/ingest', { method: 'POST' })
      if (response.ok) {
        alert('Knowledge ingested successfully!')
        loadStatus()
      } else {
        const data = await response.json()
        alert(`Failed to ingest: ${data.error}`)
      }
    } catch (error) {
      console.error('Error ingesting knowledge:', error)
      alert('Failed to ingest knowledge')
    } finally {
      setIngesting(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Knowledge Management</h1>
        <button onClick={() => router.push('/')} className={styles.backBtn}>
          ← Back to Chat
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2>Knowledge Sources</h2>
          {loading ? (
            <p>Loading...</p>
          ) : sources.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No knowledge sources ingested yet.</p>
              <p>Place your documents in the <code>/data</code> folder and click Ingest below.</p>
            </div>
          ) : (
            <div className={styles.sourceList}>
              {sources.map((source, idx) => (
                <div key={idx} className={styles.sourceCard}>
                  <h3>{source.name}</h3>
                  <div className={styles.sourceDetails}>
                    <span>Version: {source.version}</span>
                    <span>Chunks: {source.chunkCount}</span>
                    <span>Updated: {new Date(source.updatedAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className={styles.stats}>
            <strong>Total Chunks:</strong> {totalChunks}
          </div>
        </div>

        <div className={styles.section}>
          <h2>Ingest Knowledge</h2>
          <p>
            This will read documents from the <code>/data</code> folder,
            chunk them, create embeddings, and store them in the database.
          </p>
          <ul>
            <li><code>data/current_state_assessment.md</code></li>
            <li><code>data/playing_to_win.md</code></li>
          </ul>
          <button
            onClick={handleIngest}
            disabled={ingesting}
            className={styles.ingestBtn}
          >
            {ingesting ? 'Ingesting...' : 'Ingest Knowledge'}
          </button>
        </div>

        <div className={styles.section}>
          <h2>Instructions</h2>
          <ol>
            <li>Replace the placeholder files in <code>/data</code> with your actual documents</li>
            <li>Click "Ingest Knowledge" to process the documents</li>
            <li>The system will chunk the text and create embeddings</li>
            <li>Chat messages will automatically retrieve relevant context when "Use Knowledge" is enabled</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
