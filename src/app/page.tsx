import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import ChatInterface from '@/components/ChatInterface'

export default async function HomePage() {
  const session = await getSession()

  if (!session.isAuthenticated) {
    redirect('/login')
  }

  return <ChatInterface />
}
