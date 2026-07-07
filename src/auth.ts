import type { User } from './types'

const USERS: User[] = [
  { username: 'superadmin', role: 'superadmin' },
  { username: 'owner', role: 'owner' },
]

const PASSWORD = 'password123'

export function authenticate(username: string, password: string): User | null {
  if (password !== PASSWORD) return null
  return USERS.find(u => u.username === username) ?? null
}
