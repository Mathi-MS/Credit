export type Role = 'superadmin' | 'owner'

export interface User {
  username: string
  role: Role
}
