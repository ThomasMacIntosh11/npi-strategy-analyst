import { knowledgeStore } from './knowledge-store'
import { createEmbedding, cosineSimilarity } from './openai'
import fs from 'fs/promises'
import path from 'path'

export interface KnowledgeChunk {
  id: string
  sourceName: string
  content: string
  similarity?: number
}

export async function chunkText(text: string, chunkSize = 1000, overlap = 200): Promise<string[]> {
  const chunks: string[] = []
  let start = 0
  
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length)
    chunks.push(text.slice(start, end))
    start = end - overlap
    
    if (start >= text.length - overlap) break
  }
  
  return chunks
}

export async function ingestKnowledgeSource(
  name: string,
  content: string,
  version: string = new Date().toISOString()
): Promise<number> {
  // Create new source (deletes existing with same name)
  const source = await knowledgeStore.createSource(name, version)

  // Chunk the content
  const chunks = await chunkText(content)
  
  // Create embeddings and store chunks
  let count = 0
  for (const chunk of chunks) {
    try {
      const embedding = await createEmbedding(chunk)
      await knowledgeStore.createChunk(
        source.id,
        name,
        chunk,
        JSON.stringify(embedding)
      )
      count++
    } catch (error) {
      console.error(`Error creating embedding for chunk in ${name}:`, error)
    }
  }

  return count
}

export async function retrieveRelevantChunks(
  query: string,
  topK: number = 5
): Promise<KnowledgeChunk[]> {
  // Get query embedding
  const queryEmbedding = await createEmbedding(query)
  
  // Retrieve all chunks (for workshop scale, this is acceptable)
  const allChunks = await knowledgeStore.getAllChunks()

  // Calculate similarities
  const chunksWithSimilarity = allChunks.map(chunk => {
    const embedding = JSON.parse(chunk.embeddingJson)
    const similarity = cosineSimilarity(queryEmbedding, embedding)
    return {
      id: chunk.id,
      sourceName: chunk.sourceName,
      content: chunk.content,
      similarity
    }
  })

  // Sort by similarity and take top K
  chunksWithSimilarity.sort((a, b) => b.similarity - a.similarity)
  return chunksWithSimilarity.slice(0, topK)
}

export async function ingestDefaultKnowledge(): Promise<void> {
  const dataDir = path.join(process.cwd(), 'data')
  
  try {
    // Ingest Current State Assessment
    const currentStateContent = await fs.readFile(
      path.join(dataDir, 'current_state_assessment.md'),
      'utf-8'
    )
    await ingestKnowledgeSource('Current State Assessment – Jan 2025', currentStateContent)
    
    // Ingest Playing to Win Framework
    const playingToWinContent = await fs.readFile(
      path.join(dataDir, 'playing_to_win.md'),
      'utf-8'
    )
    await ingestKnowledgeSource('Playing to Win Framework', playingToWinContent)
    
    console.log('Successfully ingested knowledge sources')
  } catch (error) {
    console.error('Error ingesting knowledge:', error)
    throw error
  }
}
