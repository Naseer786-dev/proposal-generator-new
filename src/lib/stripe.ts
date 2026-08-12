import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export async function createPaymentLink(
  proposalId: string,
  amountInCents: number,
  description?: string
) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: description || 'Project Deposit',
          },
          unit_amount: amountInCents,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/proposal/${proposalId}?paid=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/proposal/${proposalId}?canceled=true`,
  })

  return { url: session.url!, demo: false }
}
