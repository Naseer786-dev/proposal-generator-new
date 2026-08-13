"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FileText, User, Mail, Calendar, DollarSign, CreditCard, Clock, Package } from "lucide-react";

export default function ProposalPage() {
  const { id } = useParams();
  const [proposal, setProposal] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/proposals?id=${id}`)
      .then((r) => r.json())
      .then((data) => setProposal(data.proposal))
      .catch(() => setError("Failed to load proposal"));
  }, [id]);

  const handlePayment = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/create-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposalId: id,
          amount: proposal?.deposit || 2500,
          description: `Deposit for ${proposal?.project_title || "Project"}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      if (data.url) window.location.href = data.url;
      else throw new Error("No URL");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!proposal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-pulse text-indigo-600 font-medium">Loading proposal...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">PropGen</h1>
            <p className="text-xs text-gray-500">Professional Proposal</p>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium">
            <Clock className="w-4 h-4" />
            Awaiting Deposit
          </span>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
            <p className="text-indigo-100 text-sm font-medium mb-2 uppercase tracking-wider">Project Proposal</p>
            <h2 className="text-3xl font-bold mb-2">{proposal.project_title}</h2>
            <p className="text-indigo-100">Prepared for {proposal.client_name}</p>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <InfoRow icon={<User className="w-4 h-4" />} label="Client" value={proposal.client_name} />
              <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={proposal.client_email} />
              <InfoRow icon={<Package className="w-4 h-4" />} label="Project Type" value={proposal.project_type} />
              <InfoRow icon={<Calendar className="w-4 h-4" />} label="Duration" value={proposal.duration} />
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Project Scope</h3>
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <p className="text-gray-700 leading-relaxed">{proposal.scope}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Deliverables</h3>
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <p className="text-gray-700 leading-relaxed">{proposal.deliverables}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 mb-8">
              <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-4">Pricing Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Project Price</span>
                  <span className="text-gray-900 font-semibold">${proposal.total_price?.toLocaleString()}</span>
                </div>
                <div className="h-px bg-indigo-100" />
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Deposit ({proposal.deposit_percent}%)</span>
                  <span className="text-indigo-700 font-bold text-lg">${proposal.deposit?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Balance Due on Completion</span>
                  <span className="text-gray-700 font-medium">${proposal.balance?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">{error}</div>
            )}

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full group relative flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-bold rounded-2xl shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <CreditCard className="w-5 h-5" />
              {loading ? "Processing..." : `Pay $${proposal.deposit?.toLocaleString()} Deposit`}
            </button>

            <p className="text-center text-gray-400 text-xs mt-4">
              Secure payment powered by PayPal. You can pay with card or PayPal account.
            </p>
          </div>
        </div>

        <div className="text-center mt-8 text-gray-400 text-sm">
          <p>Questions? Contact the project owner directly.</p>
        </div>
      </main>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
      <div className="text-indigo-500">{icon}</div>
      <div>
        <p className="text-xs text-gray-400 uppercase">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}