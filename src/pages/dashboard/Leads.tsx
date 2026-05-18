import React, { useState, useEffect, useCallback } from 'react'
import type { Lead } from '@/types/lead'
import apiClient from '@/api/client'
import { ApiError } from '@/utils/api-error'
import { ChevronLeft, ChevronRight, AlertTriangle, Inbox, Edit2, Trash2, Plus } from 'lucide-react'
import LeadFormModal from '@/components/modals/LeadFormModal'
import DeleteLeadModal from '@/components/modals/DeleteLeadModal'

const getStatusStyles = (status: Lead['status']) => {
  switch (status) {
    case 'Qualified':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20'
    case 'Contacted':
      return 'bg-blue-50 text-blue-700 ring-blue-600/10 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20'
    case 'Lost':
      return 'bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20'
    default:
      return 'bg-amber-50 text-amber-700 ring-amber-600/10 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20'
  }
}

const TableSkeleton: React.FC = () => {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <tr key={i} className="animate-pulse border-b border-neutral-100 dark:border-neutral-800">
          <td className="px-6 py-4"><div className="h-4 w-24 rounded bg-neutral-200 dark:bg-neutral-800" /></td>
          <td className="px-6 py-4"><div className="h-4 w-36 rounded bg-neutral-200 dark:bg-neutral-800" /></td>
          <td className="px-6 py-4"><div className="h-4 w-16 rounded bg-neutral-200 dark:bg-neutral-800" /></td>
          <td className="px-6 py-4"><div className="h-4 w-20 rounded bg-neutral-200 dark:bg-neutral-800" /></td>
          <td className="px-6 py-4"><div className="h-4 w-28 rounded bg-neutral-200 dark:bg-neutral-800" /></td>
          <td className="px-6 py-4 text-right"><div className="ml-auto h-4 w-12 rounded bg-neutral-200 dark:bg-neutral-800" /></td>
        </tr>
      ))}
    </>
  )
}

export const Leads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalLeads, setTotalLeads] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      interface BackendLeadsResponse {
        success: boolean
        data: Lead[]
        pagination: {
          page: number
          limit: number
          total: number
          totalPages: number
        }
      }
      const response = await apiClient.get<BackendLeadsResponse>(`/leads?page=${page}&limit=10`)
      const resData = response.data
      setLeads(resData.data || [])
      setTotalPages(resData.pagination.totalPages || 1)
      setTotalLeads(resData.pagination.total || 0)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Failed to load leads. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1)
  }

  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Leads
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Manage, qualify, and track your incoming smart leads.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedLead(null)
            setIsFormOpen(true)
          }}
          className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 focus:outline-none dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100"
        >
          <Plus className="h-4 w-4" />
          Add Lead
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
        <div className="overflow-x-auto">
          {error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-red-50 p-3 text-red-600 dark:bg-red-950/20 dark:text-red-400">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                Failed to load leads
              </h3>
              <p className="mt-1 text-sm text-neutral-500 max-w-xs">{error}</p>
              <button
                onClick={() => fetchLeads()}
                className="mt-4 rounded-md bg-neutral-900 px-3 py-2 text-xs font-semibold text-white shadow-xs hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200"
              >
                Try Again
              </button>
            </div>
          ) : !loading && leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-neutral-100 p-3 text-neutral-600 dark:bg-neutral-850 dark:text-neutral-400">
                <Inbox className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                No leads available
              </h3>
              <p className="mt-1 text-sm text-neutral-500">
                Your smart leads inventory is currently empty.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/50 text-xs font-semibold text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-400">
                  <th className="px-6 py-3.5">Name</th>
                  <th className="px-6 py-3.5">Email Address</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Source</th>
                  <th className="px-6 py-3.5">Created Date</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-sm text-neutral-900 dark:divide-neutral-800 dark:text-neutral-100">
                {loading ? (
                  <TableSkeleton />
                ) : (
                  leads.map((lead) => (
                    <tr
                      key={lead.id || lead._id}
                      className="hover:bg-neutral-50/50 transition-colors duration-150 dark:hover:bg-neutral-900/30"
                    >
                      <td className="px-6 py-4 font-medium">{lead.name}</td>
                      <td className="px-6 py-4 text-neutral-500 dark:text-neutral-400">
                        {lead.email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusStyles(
                            lead.status
                          )}`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-neutral-500 dark:text-neutral-400">
                        {lead.source}
                      </td>
                      <td className="px-6 py-4 text-neutral-500 dark:text-neutral-400">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setSelectedLead(lead)
                              setIsFormOpen(true)
                            }}
                            className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedLead(lead)
                              setIsDeleteOpen(true)
                            }}
                            className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-red-600 dark:hover:bg-neutral-800 dark:hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {!error && (loading || leads.length > 0) && (
          <div className="flex items-center justify-between border-t border-neutral-200 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex-1 text-sm text-neutral-500 dark:text-neutral-400">
              {loading ? (
                <span>Loading leads...</span>
              ) : (
                <span>
                  Showing{' '}
                  <span className="font-semibold text-neutral-900 dark:text-neutral-50">
                    {(page - 1) * 10 + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-semibold text-neutral-900 dark:text-neutral-50">
                    {Math.min(page * 10, totalLeads)}
                  </span>{' '}
                  of{' '}
                  <span className="font-semibold text-neutral-900 dark:text-neutral-50">
                    {totalLeads}
                  </span>{' '}
                  leads
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={page === 1 || loading}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-600 shadow-xs transition-colors duration-150 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 px-2">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={page === totalPages || loading}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-600 shadow-xs transition-colors duration-150 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <LeadFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setSelectedLead(null)
        }}
        onSuccess={fetchLeads}
        lead={selectedLead}
      />

      <DeleteLeadModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false)
          setSelectedLead(null)
        }}
        onSuccess={fetchLeads}
        lead={selectedLead}
      />
    </div>
  )
}

export default Leads
