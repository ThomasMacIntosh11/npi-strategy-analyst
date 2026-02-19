// In-memory storage for knowledge chunks
export interface KnowledgeChunk {
  id: string
  sourceName: string
  content: string
  embeddingJson: string
  createdAt: Date
}

interface KnowledgeSource {
  id: string
  name: string
  version: string
  createdAt: Date
}

class KnowledgeStore {
  private sourcesStore = new Map<string, KnowledgeSource>()
  private chunksStore = new Map<string, KnowledgeChunk>()
  private sourceNameIndex = new Map<string, string>() // name -> id mapping

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15)
  }

  // Source operations
  async createSource(name: string, version: string): Promise<KnowledgeSource> {
    // Delete existing source with same name
    if (this.sourceNameIndex.has(name)) {
      const oldId = this.sourceNameIndex.get(name)!
      this.sourcesStore.delete(oldId)
      // Delete all chunks from old source
      const chunksToDelete = Array.from(this.chunksStore.values())
        .filter(c => c.sourceName === name)
      chunksToDelete.forEach(c => this.chunksStore.delete(c.id))
    }

    const id = this.generateId()
    const source: KnowledgeSource = {
      id,
      name,
      version,
      createdAt: new Date()
    }
    this.sourcesStore.set(id, source)
    this.sourceNameIndex.set(name, id)
    return source
  }

  async getSource(id: string): Promise<KnowledgeSource | null> {
    return this.sourcesStore.get(id) || null
  }

  async getSourceByName(name: string): Promise<KnowledgeSource | null> {
    const id = this.sourceNameIndex.get(name)
    if (!id) return null
    return this.sourcesStore.get(id) || null
  }

  // Chunk operations
  async createChunk(
    sourceId: string,
    sourceName: string,
    content: string,
    embeddingJson: string
  ): Promise<KnowledgeChunk> {
    const id = this.generateId()
    const chunk: KnowledgeChunk = {
      id,
      sourceName,
      content,
      embeddingJson,
      createdAt: new Date()
    }
    this.chunksStore.set(id, chunk)
    return chunk
  }

  async getAllChunks(): Promise<KnowledgeChunk[]> {
    return Array.from(this.chunksStore.values())
  }

  async getChunksBySource(sourceName: string): Promise<KnowledgeChunk[]> {
    return Array.from(this.chunksStore.values())
      .filter(c => c.sourceName === sourceName)
  }

  async deleteSourceChunks(sourceName: string): Promise<void> {
    const chunksToDelete = Array.from(this.chunksStore.entries())
      .filter(([_, chunk]) => chunk.sourceName === sourceName)
    chunksToDelete.forEach(([id]) => this.chunksStore.delete(id))
  }

  // Stats
  getStats() {
    return {
      sources: this.sourcesStore.size,
      chunks: this.chunksStore.size,
      sources_list: Array.from(this.sourcesStore.values()).map(s => s.name)
    }
  }
}

// Export singleton instance
export const knowledgeStore = new KnowledgeStore()
