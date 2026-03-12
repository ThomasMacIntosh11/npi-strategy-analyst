import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import DVFMatrix from '@/components/DVFMatrix'

export default async function DVFPage() {
  const session = await getSession()

  if (!session.isAuthenticated) {
    redirect('/login')
  }

  return <DVFMatrix />
}