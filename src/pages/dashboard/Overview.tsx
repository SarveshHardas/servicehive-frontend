import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, UserCheck, PhoneCall, AlertCircle, Plus, Download, ArrowRight, Inbox } from 'lucide-react'
import type { Lead } from '@/types/lead'
import apiClient from '@/api/client'
import { ApiError } from '@/utils/api-error'
import LeadFormModal from '@/components/modals/LeadFormModal'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'

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

const OverviewSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-850 dark:bg-neutral-900" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 h-80 rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-850 dark:bg-neutral-900" />
        <div className="h-80 rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-850 dark:bg-neutral-900" />
      </div>
    </div>
  )
}

export const Overview: React.FC = () => {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const { success, error: showToastError } = useToast()

  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      interface BackendLeadsResponse {
        success: boolean
        data: Lead[]
      }
      const response = await apiClient.get<BackendLeadsResponse>('/leads?limit=1000')
      setLeads(response.data.data || [])
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Failed to load dashboard metrics')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const handleExportCSV = async () => {
    try {
      setExporting(true)
      const response = await apiClient.get('/leads/export', {
        responseType: 'blob',
      })
      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `leads-export-${Date.now()}.csv`)
      document.body.appendChild(link)
      link.click()
      link.parentNode?.removeChild(link)
      window.URL.revokeObjectURL(url)
      success('Leads exported successfully')
    } catch {
      showToastError('Failed to export CSV. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  if (loading) return <OverviewSkeleton />

  const totalLeads = leads.length
  const qualifiedLeads = leads.filter((l) => l.status === 'Qualified').length
  const contactedLeads = leads.filter((l) => l.status === 'Contacted').length
  const lostLeads = leads.filter((l) => l.status === 'Lost').length
  const newLeads = leads.filter((l) => l.status === 'New').length

  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  const cards = [
    { label: 'Total Leads', value: totalLeads, icon: Users, color: 'text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-850' },
    { label: 'Qualified Leads', value: qualifiedLeads, icon: UserCheck, color: 'text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 dark:text-emerald-400' },
    { label: 'Contacted Leads', value: contactedLeads, icon: PhoneCall, color: 'text-blue-600 bg-blue-50/50 dark:bg-blue-950/20 dark:text-blue-400' },
    { label: 'Lost Leads', value: lostLeads, icon: AlertCircle, color: 'text-red-600 bg-red-50/50 dark:bg-red-950/20 dark:text-red-400' },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          Overview
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Welcome back! Here is a summary of your smart leads inventory.
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm font-medium text-red-600 dark:bg-red-955/20 dark:text-red-400 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchStats} className="text-xs underline hover:no-underline">Try Again</button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className="rounded-lg border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 flex items-center justify-between"
            >
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  {card.label}
                </p>
                <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
                  {card.value}
                </p>
              </div>
              <div className={`rounded-full p-3.5 ${card.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-lg border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900 flex flex-col justify-between overflow-hidden">
          <div className="px-6 py-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-50">
              Recent Leads Preview
            </h3>
            <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/10 dark:bg-amber-500/10 dark:text-amber-400">
              {newLeads} New
            </span>
          </div>

          <div className="flex-1 overflow-x-auto">
            {recentLeads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Inbox className="h-6 w-6 text-neutral-400" />
                <p className="mt-2 text-sm text-neutral-500">No recent leads found.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs font-semibold text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-400">
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Email Address</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-sm text-neutral-900 dark:divide-neutral-800 dark:text-neutral-100">
                  {recentLeads.map((lead) => (
                    <tr key={lead.id || lead._id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30">
                      <td className="px-6 py-3.5 font-medium">{lead.name}</td>
                      <td className="px-6 py-3.5 text-neutral-500 dark:text-neutral-400">{lead.email}</td>
                      <td className="px-6 py-3.5">
                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${getStatusStyles(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="border-t border-neutral-100 bg-neutral-50/30 px-6 py-4 dark:border-neutral-800">
            <Link
              to="/leads"
              className="inline-flex items-center gap-1 text-sm font-semibold text-neutral-900 hover:text-neutral-700 dark:text-white dark:hover:text-neutral-300"
            >
              View All Leads
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-6">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-50 border-b border-neutral-100 pb-4 dark:border-neutral-800">
            Quick Actions
          </h3>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex w-full items-center justify-between rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              <span className="flex items-center gap-2">
                <Plus className="h-4 w-4 text-neutral-500" />
                Add New Lead
              </span>
              <ArrowRight className="h-4 w-4 text-neutral-400" />
            </button>

            {isAdmin && (
              <button
                onClick={handleExportCSV}
                disabled={exporting}
                className="flex w-full items-center justify-between rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <span className="flex items-center gap-2">
                  {exporting ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-400 border-t-transparent dark:border-neutral-500" />
                  ) : (
                    <Download className="h-4 w-4 text-neutral-500" />
                  )}
                  Export Leads CSV
                </span>
                <ArrowRight className="h-4 w-4 text-neutral-400" />
              </button>
            )}

            <Link
              to="/leads"
              className="flex w-full items-center justify-between rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4 text-neutral-500" />
                Manage Inventory
              </span>
              <ArrowRight className="h-4 w-4 text-neutral-400" />
            </Link>
          </div>
        </div>
      </div>

      <LeadFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchStats}
        lead={null}
      />
    </div>
  )
}

export default Overview
