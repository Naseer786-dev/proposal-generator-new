"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Loader2, CreditCard, FileText } from "lucide-react"

export default function ProposalView() {
  const { id } = useParams()
  const [proposal, setProposal] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [payLoading, setPayLoading] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(`proposal_${id}`)
    if (stored) {
      setProposal(JSON.parse(stored))
      setLoading(false)
      return
    }

    fetch(`/api/proposals?id=${id}`)
      .then(r => r.json())
      .then(data => {
        setProposal(data.proposal)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const handlePayment = async () => {
    setPayLoading(true)
    try {
      const res = await fetch("/api/stripe/create-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposalId: id,
          amount: proposal?.deposit,
          description: `Deposit for ${proposal?.project_title}`,
        }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert("Error: " + (data.error || "No URL returned"))
    } catch (e) {
      alert("Payment link creation failed. Check console.")
    } finally {
      setPayLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!proposal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Proposal not found.</p>
      </div>
    )
  }

  const content = proposal.content || {}

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            <span className="font-bold">PropGen</span>
          </div>
          <Badge variant={proposal.status === "accepted" ? "default" : "secondary"}>
            {proposal.status === "accepted" ? "Accepted" : "Pending"}
          </Badge>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-8 md:p-12">
            <div className="border-b pb-6 mb-8">
              <h1 className="text-3xl font-bold mb-2">Project Proposal</h1>
              <p className="text-gray-500">Prepared for {proposal.client_name}</p>
              <p className="text-gray-400 text-sm">{new Date(proposal.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            <div className="space-y-8">
              {content.greeting && (
                <div>
                  <p className="text-lg leading-relaxed">{content.greeting}</p>
                </div>
              )}

              {content.executiveSummary && (
                <div>
                  <h2 className="text-lg font-bold mb-2">Executive Summary</h2>
                  <p className="text-gray-700 leading-relaxed">{content.executiveSummary}</p>
                </div>
              )}

              {content.scopeOfWork && (
                <div>
                  <h2 className="text-lg font-bold mb-3">Scope of Work</h2>
                  <ul className="space-y-2">
                    {(Array.isArray(content.scopeOfWork) ? content.scopeOfWork : [content.scopeOfWork]).map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {proposal.scope && !content.scopeOfWork && (
                <div>
                  <h2 className="text-lg font-bold mb-2">Scope of Work</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{proposal.scope}</p>
                </div>
              )}

              {content.timeline && (
                <div>
                  <h2 className="text-lg font-bold mb-2">Timeline</h2>
                  <p className="text-gray-700">{content.timeline}</p>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-lg font-bold mb-4">Investment</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Project Value</span>
                    <span className="font-bold">${proposal.total_price?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deposit ({Math.round((proposal.deposit / proposal.total_price) * 100)}%)</span>
                    <span className="font-bold">${proposal.deposit?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Balance on Completion</span>
                    <span className="font-bold">${(proposal.total_price - proposal.deposit)?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {content.terms && (
                <div>
                  <h2 className="text-lg font-bold mb-2">Terms & Conditions</h2>
                  <p className="text-gray-700 text-sm leading-relaxed">{content.terms}</p>
                </div>
              )}

              {content.callToAction && (
                <div>
                  <p className="text-gray-700 leading-relaxed">{content.callToAction}</p>
                </div>
              )}
            </div>

            {proposal.status !== "accepted" && (
              <div className="mt-10 pt-8 border-t flex flex-col sm:flex-row gap-4 items-center justify-center">
                <Button size="lg" className="gap-2 w-full sm:w-auto" onClick={handlePayment} disabled={payLoading}>
                  {payLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                  {payLoading ? "Creating payment..." : `Pay $${proposal.deposit?.toLocaleString()} Deposit`}
                </Button>
                <p className="text-sm text-gray-500">Secure payment via Stripe</p>
              </div>
            )}

            {proposal.status === "accepted" && (
              <div className="mt-10 pt-8 border-t text-center">
                <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">This proposal has been accepted</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-400 mt-6">
          Powered by PropGen &bull; Professional proposals for freelancers
        </p>
      </div>
    </div>
  )
}
