export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { mockInsert, mockSelect } from '@/lib/db'
import { generateProposal } from '@/lib/ai'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const total = parseInt(body.totalPrice || '5000')
    const depositPercent = parseInt(body.depositPercent || '50')
    const deposit = Math.round(total * depositPercent / 100)

    const proposal = {
      id: Math.random().toString(36).substring(2, 15),
      client_name: body.clientName || '',
      client_email: body.clientEmail || '',
      project_type: body.projectType || '',
      project_title: body.projectTitle || '',
      scope: body.scope || '',
      deliverables: body.deliverables || '',
      duration: body.duration || '',
      total_price: total,
      deposit_percent: depositPercent,
      deposit: deposit,
      balance: total - deposit,
      status: 'draft',
      stripe_payment_link: null,
      created_at: new Date().toISOString(),
      content: generateProposal(body)
    }

    const { data } = await mockInsert('proposals', proposal)
    return NextResponse.json({ proposal: data })
  } catch (err: any) {
    console.error('Proposals POST error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (id) {
      const { data } = await mockSelect('proposals', { id })
      const proposal = data?.[0]
      if (proposal) return NextResponse.json({ proposal })
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ error: 'ID required' }, { status: 400 })
  } catch (err: any) {
    console.error('Proposals GET error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}