import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../hooks/use-theme'

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="rounded-md p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  )
}

export default ThemeToggle
