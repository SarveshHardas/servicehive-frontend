/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useCallback } from 'react'

export type ToastType = 'success' | 'error'

export interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  success: (message: string) => void
  error: (message: string) => void
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      removeToast(id)
    }, 3000)
  }, [removeToast])

  const success = useCallback((message: string) => addToast(message, 'success'), [addToast])
  const error = useCallback((message: string) => addToast(message, 'error'), [addToast])

  return (
    <ToastContext.Provider value={{ success, error }}>
      {children}
      <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-2 max-w-sm w-full">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center justify-between rounded-md border p-4 shadow-lg transition-all duration-300 ${
              t.type === 'success'
                ? 'border-emerald-100 bg-white text-emerald-800 dark:border-emerald-950 dark:bg-neutral-900 dark:text-emerald-400'
                : 'border-red-100 bg-white text-red-800 dark:border-red-950 dark:bg-neutral-900 dark:text-red-400'
            }`}
          >
            <span className="text-sm font-medium">{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              className="ml-4 text-neutral-400 hover:text-neutral-600 focus:outline-none dark:hover:text-neutral-300"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
