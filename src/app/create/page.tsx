"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, FileText, User, Briefcase, ListChecks, Clock, DollarSign, CheckCircle, Loader2 } from "lucide-react";

const steps = [
  { id: 1, title: "Client Info", icon: User },
  { id: 2, title: "Project Details", icon: Briefcase },
  { id: 3, title: "Scope & Deliverables", icon: ListChecks },
  { id: 4, title: "Timeline", icon: Clock },
  { id: 5, title: "Pricing", icon: DollarSign },
];

export default function CreateProposalPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    clientName: "",
    clientEmail: "",
    projectType: "",
    projectTitle: "",
    scope: "",
    deliverables: "",
    duration: "",
    totalPrice: "5000",
    depositPercent: "50",
  });

  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.proposal?.id) router.push(`/proposal/${data.proposal.id}`);
    } finally {
      setLoading(false);
    }
  };

  const progress = ((step - 1) / (steps.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
              PropGen
            </span>
          </div>
          <div className="text-sm text-gray-500">Step {step} of {steps.length}</div>
        </div>
        <div className="h-1 bg-gray-100">
          <div className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-10">
          {steps.map((s) => {
            const Icon = s.icon;
            const isActive = s.id === step;
            const isDone = s.id < step;
            return (
              <div key={s.id} className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isActive ? "bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200 scale-110" : isDone ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                  {isDone ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className={`text-xs font-medium ${isActive ? "text-indigo-700" : isDone ? "text-emerald-600" : "text-gray-400"}`}>{s.title}</span>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 p-8">
          {step === 1 && (
            <StepContent title="Client Information" subtitle="Who is this proposal for?">
              <Input label="Client Name" value={form.clientName} onChange={(v) => update("clientName", v)} placeholder="e.g. Acme Corporation" />
              <Input label="Client Email" value={form.clientEmail} onChange={(v) => update("clientEmail", v)} placeholder="contact@acme.com" type="email" />
            </StepContent>
          )}

          {step === 2 && (
            <StepContent title="Project Details" subtitle="What type of project is this?">
              <Input label="Project Type" value={form.projectType} onChange={(v) => update("projectType", v)} placeholder="e.g. Web Design, Mobile App" />
              <Input label="Project Title" value={form.projectTitle} onChange={(v) => update("projectTitle", v)} placeholder="e.g. E-commerce Website Redesign" />
            </StepContent>
          )}

          {step === 3 && (
            <StepContent title="Scope & Deliverables" subtitle="What will you deliver?">
              <TextArea label="Project Scope" value={form.scope} onChange={(v) => update("scope", v)} placeholder="Describe the overall project scope..." />
              <TextArea label="Deliverables" value={form.deliverables} onChange={(v) => update("deliverables", v)} placeholder="List specific deliverables (homepage, logo files, etc.)..." />
            </StepContent>
          )}

          {step === 4 && (
            <StepContent title="Timeline" subtitle="How long will this take?">
              <Input label="Project Duration" value={form.duration} onChange={(v) => update("duration", v)} placeholder="e.g. 3 weeks, 2 months" />
            </StepContent>
          )}

          {step === 5 && (
            <StepContent title="Pricing" subtitle="Set your price and deposit">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Total Price ($)" value={form.totalPrice} onChange={(v) => update("totalPrice", v)} placeholder="5000" type="number" />
                <Input label="Deposit %" value={form.depositPercent} onChange={(v) => update("depositPercent", v)} placeholder="50" type="number" />
              </div>
              <div className="mt-6 p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Deposit Amount</span>
                  <span className="text-2xl font-bold text-indigo-700">${Math.round(Number(form.totalPrice) * Number(form.depositPercent) / 100).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Balance on Completion</span>
                  <span className="text-gray-700 font-medium">${(Number(form.totalPrice) - Math.round(Number(form.totalPrice) * Number(form.depositPercent) / 100)).toLocaleString()}</span>
                </div>
              </div>
            </StepContent>
          )}

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <button onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1} className="flex items-center gap-2 px-5 py-3 text-gray-500 hover:text-gray-900 font-medium disabled:opacity-30 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            {step < steps.length ? (
              <button onClick={() => setStep((s) => s + 1)} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all hover:-translate-y-0.5">
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 transition-all hover:-translate-y-0.5 disabled:opacity-60">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                {loading ? "Generating..." : "Generate Proposal"}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function StepContent({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">{title}</h2>
      <p className="text-gray-500 mb-6">{subtitle}</p>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none" />
    </div>
  );
}