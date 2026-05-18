import React from 'react'
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
}

export const Button: React.FC<ButtonProps> = ({ children, loading, className = '', disabled, ...props }) => {
  return (
    <button
      disabled={disabled || loading}
      className={`flex w-full items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-500 ${className}`}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-400 border-t-transparent dark:border-neutral-500 dark:border-t-transparent" />
      ) : (
        children
      )}
    </button>
  )
}

export default Button
