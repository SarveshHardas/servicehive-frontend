import React from 'react'
import { useAuth } from '../../hooks/use-auth'

export const Login: React.FC = () => {
  const { login } = useAuth()

  const handleMockLogin = () => {
    login('mock-token', {
      id: 'mock-id',
      name: 'Guest Intern',
      email: 'guest@example.com',
      role: 'admin',
    })
    window.location.href = '/'
  }

  return (
    <div className="space-y-4">
      <h2 className="text-center text-lg font-semibold text-neutral-900 dark:text-neutral-50">
        Sign In
      </h2>
      <button
        onClick={handleMockLogin}
        className="w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100"
      >
        Mock Sign In
      </button>
    </div>
  )
}

export default Login
