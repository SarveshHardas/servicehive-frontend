import { z } from 'zod'

export const leadSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be under 100 characters'),
  email: z.string().email('Invalid email address'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']),
  source: z.enum(['Website', 'Instagram', 'Referral']),
})

export type LeadInput = z.infer<typeof leadSchema>
