import './globals.css'

export const metadata = {
  title: 'PropGen - Proposal Generator',
  description: 'Generate professional proposals with Stripe payments',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white">{children}</body>
    </html>
  )
}