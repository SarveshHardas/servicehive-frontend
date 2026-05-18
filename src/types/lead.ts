export interface Lead {
  id: string
  _id?: string
  name: string
  email: string
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost'
  source: 'Website' | 'Instagram' | 'Referral'
  createdAt: string
}

export interface LeadsResponse {
  leads: Lead[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}
