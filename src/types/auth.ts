export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
}

export interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
}
