export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createPaymentLink } from '@/lib/stripe'
import { mockUpdate } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { proposalId, amount, description } = await req.json()

    if (!proposalId) {
      return NextResponse.json({ error: 'Proposal ID required' }, { status: 400 })
    }

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const { url, demo } = await createPaymentLink(
      proposalId, 
      Math.round(amount), 
      description || 'Project Deposit'
    )

    await mockUpdate('proposals', proposalId, { 
      stripe_payment_link: url, 
      status: 'sent' 
    })

    return NextResponse.json({ url, demo })
  } catch (err: any) {
    console.error('Stripe API error:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to create payment link' }, 
      { status: 500 }
    )
  }
}