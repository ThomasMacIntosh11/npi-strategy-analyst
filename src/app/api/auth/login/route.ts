import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { validateAccessCode } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { accessCode } = await request.json()

    if (!validateAccessCode(accessCode)) {
      return NextResponse.json(
        { error: 'Invalid access code' },
        { status: 401 }
      )
    }

    const session = await getSession()
    session.isAuthenticated = true
    session.createdAt = Date.now()
    await session.save()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}
