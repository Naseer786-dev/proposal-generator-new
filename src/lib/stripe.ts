import Stripe from 'stripe'

const stripeKey = process.env.STRIPE_SECRET_KEY

const stripe = new Stripe(stripeKey || 'sk_test_placeholder', {
  apiVersion: '2026-07-29.dahlia',
})

export async function createPaymentLink(
  proposalId: string, 
  amount: number, 
  description: string
) {
  if (!stripeKey || stripeKey === 'sk_test_placeholder') {
    console.warn('DEMO MODE: No STRIPE_SECRET_KEY found')
    return {
      url: `https://example.com/demo-payment?proposal=${proposalId}`,
      demo: true,
    }
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: description || 'Project Deposit',
              description: `Deposit for proposal ${proposalId}`,
            },
            unit_amount: Math.round(amount),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || ''}/proposal/${proposalId}?paid=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || ''}/proposal/${proposalId}?canceled=true`,
      metadata: { proposalId, type: 'deposit' },
    })

    return { url: session.url!, demo: false }
  } catch (error) {
    console.error('Stripe error:', error)
    throw error
  }
}