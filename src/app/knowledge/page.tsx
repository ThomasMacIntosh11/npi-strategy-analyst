import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import KnowledgeManager from '@/components/KnowledgeManager'

export default async function KnowledgePage() {
  const session = await getSession()

  if (!session.isAuthenticated) {
    redirect('/login')
  }

  return <KnowledgeManager />
}
