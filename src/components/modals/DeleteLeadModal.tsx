import React, { useState } from 'react'
import { X, Trash2 } from 'lucide-react'
import type { Lead } from '../../types/lead'
import Button from '../ui/Button'
import apiClient from '../../api/client'
import { ApiError } from '../../utils/api-error'
import { useToast } from '../../hooks/use-toast'

interface DeleteLeadModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  lead: Lead | null
}

export const DeleteLeadModal: React.FC<DeleteLeadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  lead,
}) => {
  const { success, error: showToastError } = useToast()
  const [loading, setLoading] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)

  if (!isOpen || !lead) return null

  const handleDelete = async () => {
    try {
      setLoading(true)
      setGlobalError(null)
      await apiClient.delete(`/leads/${lead.id || lead._id}`)
      success('Lead deleted successfully')
      onSuccess()
      onClose()
    } catch (err) {
      let errMsg = 'Failed to delete lead. Please try again.'
      if (err instanceof ApiError) {
        errMsg = err.message
      }
      setGlobalError(errMsg)
      showToastError(errMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
      <div className="w-full max-w-sm overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3.5 dark:border-neutral-800">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-red-500" />
            Delete Lead
          </h3>
          <button
            onClick={onClose}
            className="rounded-md text-neutral-400 hover:text-neutral-500 focus:outline-none dark:hover:text-neutral-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {globalError && (
            <div className="rounded-md bg-red-50 p-3 text-xs font-medium text-red-600 dark:bg-red-950/20 dark:text-red-400">
              {globalError}
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Are you sure you want to delete lead <span className="font-semibold text-neutral-950 dark:text-neutral-50">{lead.name}</span>? This action is permanent.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              Cancel
            </button>
            <div className="w-24">
              <Button
                onClick={handleDelete}
                loading={loading}
                className="bg-red-600 hover:bg-red-500 dark:bg-red-600 dark:hover:bg-red-500 dark:hover:text-white transition-all duration-100"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteLeadModal
