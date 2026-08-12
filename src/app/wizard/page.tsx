"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { FileText, CheckCircle, Loader2 } from "lucide-react"

const STEPS = [
  { label: "Client", fields: ["clientName", "clientEmail"] },
  { label: "Project", fields: ["projectType", "projectTitle"] },
  { label: "Scope", fields: ["scope", "deliverables"] },
  { label: "Timeline", fields: ["duration"] },
  { label: "Pricing", fields: ["totalPrice", "depositPercent"] },
]

export default function Wizard() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    clientName: "",
    clientEmail: "",
    projectType: "web-design",
    projectTitle: "",
    scope: "",
    deliverables: "",
    duration: "2 weeks",
    totalPrice: "",
    depositPercent: "50",
    template: "modern",
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")

  const update = (k: string, v: string) => {
    setForm(p => ({ ...p, [k]: v }))
    setError("")
  }

  const validate = () => {
    if (step === 0 && !form.clientName.trim()) return "Client name is required"
    if (step === 1 && !form.projectTitle.trim()) return "Project title is required"
    if (step === 2 && !form.scope.trim()) return "Project scope is required"
    if (step === 4) {
      if (!form.totalPrice || parseInt(form.totalPrice) <= 0) return "Enter a valid price"
      if (!form.depositPercent || parseInt(form.depositPercent) < 0 || parseInt(form.depositPercent) > 100) return "Deposit must be 0-100%"
    }
    return ""
  }

  const next = () => {
    const err = validate()
    if (err) { setError(err); return }
    setStep(p => Math.min(p + 1, STEPS.length - 1))
  }

  const generate = async () => {
    const err = validate()
    if (err) { setError(err); return }
    setLoading(true)
    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)

      if (data.proposal) {
        localStorage.setItem(`proposal_${data.proposal.id}`, JSON.stringify(data.proposal))
      }

      setResult(data)
    } catch (e: any) {
      setError(e.message || "Failed to generate proposal")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-5 h-5" />
          <span className="font-bold">PropGen</span>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-2">
              <CardTitle>Create New Proposal</CardTitle>
              <Badge variant="outline">Step {step + 1} of {STEPS.length}</Badge>
            </div>
            <Progress value={((step + 1) / STEPS.length) * 100} className="h-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {step === 0 && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Client Name *</label>
                  <Input value={form.clientName} onChange={e => update("clientName", e.target.value)} placeholder="Acme Corporation" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Client Email</label>
                  <Input value={form.clientEmail} onChange={e => update("clientEmail", e.target.value)} placeholder="contact@acme.com" />
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Project Type</label>
                  <select value={form.projectType} onChange={e => update("projectType", e.target.value)} className="w-full border rounded-md px-3 py-2">
                    <option value="web-design">Web Design</option>
                    <option value="web-development">Web Development</option>
                    <option value="mobile-app">Mobile App</option>
                    <option value="branding">Branding</option>
                    <option value="marketing">Marketing</option>
                    <option value="consulting">Consulting</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Project Title *</label>
                  <Input value={form.projectTitle} onChange={e => update("projectTitle", e.target.value)} placeholder="E-commerce Website Redesign" />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Project Scope *</label>
                  <Textarea value={form.scope} onChange={e => update("scope", e.target.value)} placeholder="Describe the project scope..." rows={4} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Deliverables</label>
                  <Textarea value={form.deliverables} onChange={e => update("deliverables", e.target.value)} placeholder="List key deliverables..." rows={3} />
                </div>
              </>
            )}

            {step === 3 && (
              <div>
                <label className="block text-sm font-medium mb-1">Duration</label>
                <Input value={form.duration} onChange={e => update("duration", e.target.value)} placeholder="2 weeks" />
              </div>
            )}

            {step === 4 && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Total Price ($) *</label>
                  <Input type="number" value={form.totalPrice} onChange={e => update("totalPrice", e.target.value)} placeholder="5000" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Deposit Percentage (%)</label>
                  <Input type="number" value={form.depositPercent} onChange={e => update("depositPercent", e.target.value)} placeholder="50" />
                </div>
              </>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(p => Math.max(0, p - 1))} disabled={step === 0 || loading}>
                Back
              </Button>
              {step < STEPS.length - 1 ? (
                <Button onClick={next}>Next Step</Button>
              ) : (
                <Button onClick={generate} disabled={loading} className="gap-2">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  {loading ? "Generating..." : "Generate Proposal"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card className="mt-6 border-green-200 bg-green-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Proposal Generated!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white rounded-lg border p-4 mb-4 space-y-3 text-sm">
                <p><span className="font-medium">Client:</span> {form.clientName}</p>
                <p><span className="font-medium">Project:</span> {form.projectTitle}</p>
                <p><span className="font-medium">Summary:</span> {result.proposal?.content?.executiveSummary}</p>
                <p><span className="font-medium">Investment:</span> ${result.proposal?.total_price} (Deposit: ${result.proposal?.deposit})</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => router.push(`/proposal/${result.proposal?.id}`)}>
                  View Full Proposal
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
