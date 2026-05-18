import React from 'react'
import { Outlet } from 'react-router-dom'

export const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
      <header className="border-b border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-xl font-bold">Smart Leads</h1>
        </div>
      </header>
      <main className="mx-auto max-w-7xl p-6">
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout
