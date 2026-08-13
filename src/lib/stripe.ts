export async function createPaymentLink(
  proposalId: string, 
  amount: number, 
  description: string
) {
  // PayPal.Me link with auto-filled amount
  // Format: paypal.me/username/amount
  const paypalMeLink = `https://paypal.me/NMohammed150/${amount}`
  
  return {
    url: paypalMeLink,
    demo: false,
  }
}