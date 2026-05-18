import React from 'react'
import { Outlet } from 'react-router-dom'
import DotField from '@/components/background/DotField'
import ThemeToggle from '@/components/theme/ThemeToggle'
import { useTheme } from '@/hooks/use-theme'

export const AuthLayout: React.FC = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-50 px-4 py-12 text-neutral-900 transition-colors duration-200 dark:bg-neutral-950 dark:text-neutral-50">
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
          <DotField
            dotRadius={2}
            dotSpacing={12}
            cursorRadius={250}
            cursorForce={0.25}
            bulgeOnly
            bulgeStrength={24}
            glowRadius={160}
            sparkle={false}
            waveAmplitude={2}
            gradientFrom={isDark ? '#000000' : '#ffffff'}
            gradientTo={isDark ? '#746f6f' : '#cccccc'}
            glowColor={isDark ? '#120F17' : '#f4f4f5'}
          />
        </div>
      </div>

      <div className='fixed top-10 right-10'>
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-6 rounded-lg border border-neutral-200 bg-white p-8 shadow-2xl transition-colors duration-200 dark:border-neutral-800 dark:bg-neutral-900">
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
