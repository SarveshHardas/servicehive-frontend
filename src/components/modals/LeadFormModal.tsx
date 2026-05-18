import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import type { Lead } from '../../types/lead'
import { leadSchema } from '../../forms/lead'
import type { LeadInput } from '../../forms/lead'
import Input from '../ui/Input'
import Button from '../ui/Button'
import apiClient from '../../api/client'
import { ApiError } from '../../utils/api-error'

interface LeadFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  lead?: Lead | null
}

export const LeadFormModal: React.FC<LeadFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  lead,
}) => {
  const [globalError, setGlobalError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: '',
      email: '',
      status: 'New',
      source: 'Website',
    },
  })

  useEffect(() => {
    if (lead) {
      reset({
        name: lead.name,
        email: lead.email,
        status: lead.status,
        source: lead.source,
      })
    } else {
      reset({
        name: '',
        email: '',
        status: 'New',
        source: 'Website',
      })
    }
    setGlobalError(null)
  }, [lead, reset, isOpen])

  if (!isOpen) return null

  const onSubmit = async (data: LeadInput) => {
    try {
      setGlobalError(null)
      if (lead) {
        await apiClient.patch(`/leads/${lead.id || lead._id}`, data)
      } else {
        await apiClient.post('/leads', data)
      }
      onSuccess()
      onClose()
    } catch (err) {
      if (err instanceof ApiError) {
        setGlobalError(err.message)
      } else {
        setGlobalError('Failed to save lead. Please try again.')
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
      <div className="w-full max-w-md overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4 dark:border-neutral-800">
          <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
            {lead ? 'Edit Lead' : 'Create Lead'}
          </h3>
          <button
            onClick={onClose}
            className="rounded-md text-neutral-400 hover:text-neutral-500 focus:outline-none dark:hover:text-neutral-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {globalError && (
            <div className="rounded-md bg-red-50 p-3 text-xs font-medium text-red-600 dark:bg-red-950/20 dark:text-red-400">
              {globalError}
            </div>
          )}

          <Input
            label="Full Name"
            placeholder="John Doe"
            disabled={isSubmitting}
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            disabled={isSubmitting}
            error={errors.email?.message}
            {...register('email')}
          />

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400">
              Status
            </label>
            <select
              disabled={isSubmitting}
              {...register('status')}
              className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-900 focus:outline-none disabled:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50 dark:focus:border-neutral-50"
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Lost">Lost</option>
            </select>
            {errors.status && (
              <p className="text-xs font-medium text-red-600 dark:text-red-400">
                {errors.status.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400">
              Lead Source
            </label>
            <select
              disabled={isSubmitting}
              {...register('source')}
              className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-900 focus:outline-none disabled:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50 dark:focus:border-neutral-50"
            >
              <option value="Website">Website</option>
              <option value="Instagram">Instagram</option>
              <option value="Referral">Referral</option>
            </select>
            {errors.source && (
              <p className="text-xs font-medium text-red-600 dark:text-red-400">
                {errors.source.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              Cancel
            </button>
            <div className="w-32">
              <Button type="submit" loading={isSubmitting}>
                Save Lead
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LeadFormModal
