import React, { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Menu, X, LayoutDashboard, Users, LogOut } from 'lucide-react'
import { useAuth } from '../hooks/use-auth'
import ThemeToggle from '../components/theme/ThemeToggle'


export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { logout } = useAuth()

  const menuItems = [
    { label: 'Overview', path: '/', icon: LayoutDashboard },
    { label: 'Leads', path: '/leads', icon: Users },
  ]

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50 dark:bg-neutral-950">
      <div
        className={`fixed inset-0 z-20 bg-neutral-900/40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'
          }`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-neutral-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0 dark:border-neutral-800 dark:bg-neutral-900 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-neutral-100 dark:border-neutral-800">
          <span className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Smart Leads
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 lg:hidden dark:hover:bg-neutral-800 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {menuItems.map((item) => {
            const active = location.pathname === item.path
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${active
                    ? 'bg-neutral-900 text-white dark:bg-neutral-50 dark:text-neutral-900'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'
                  }`}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-neutral-200 p-4 dark:border-neutral-800">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
          >
            <LogOut className="h-4.5 w-4.5 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-6 dark:border-neutral-800 dark:bg-neutral-900">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 lg:hidden dark:hover:bg-neutral-800 dark:hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            Dashboard Session
          </span>
          <div className="flex items-center gap-4">
           <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
