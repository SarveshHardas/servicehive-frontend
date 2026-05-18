import React from 'react'
import { Outlet } from 'react-router-dom'

export const AuthLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-12 dark:bg-neutral-950">
      <div className="w-full max-w-md space-y-6 rounded-lg border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Smart Leads
          </span>
        </div>
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout
