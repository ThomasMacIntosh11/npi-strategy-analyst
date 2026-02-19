import { SessionOptions } from 'iron-session'

export interface SessionData {
  isAuthenticated: boolean
  createdAt: number
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long',
  cookieName: 'npi_strategy_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
}

export function validateAccessCode(code: string): boolean {
  const validCode = process.env.WORKSHOP_ACCESS_CODE || 'NPI2030Vision'
  return code === validCode
}
