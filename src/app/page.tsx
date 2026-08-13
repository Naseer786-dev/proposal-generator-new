"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Zap, Shield, ArrowRight, Sparkles, CheckCircle } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navbar */}
      <nav className="w-full px-6 py-4 flex items-center justify-between backdrop-blur-md bg-white/70 sticky top-0 z-50 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
            PropGen
          </span>
        </div>
        <div className="text-sm text-gray-500">Professional Proposals, Instant Payments</div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Now with PayPal Integration
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Create Proposals That
            <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              Get You Paid
            </span>
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Generate stunning project proposals in minutes and collect deposits instantly via PayPal. 
            No more chasing invoices.
          </p>

          <button
            onClick={() => router.push("/create")}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold rounded-2xl shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 transition-all duration-300 hover:-translate-y-1"
          >
            Create Your First Proposal
            <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${hovered ? "translate-x-1" : ""}`} />
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <FeatureCard
            icon={<Zap className="w-6 h-6 text-amber-500" />}
            title="Lightning Fast"
            desc="Create professional proposals in under 2 minutes with our guided wizard."
            color="amber"
          />
          <FeatureCard
            icon={<Shield className="w-6 h-6 text-emerald-500" />}
            title="Secure Payments"
            desc="Clients pay deposits securely via PayPal with buyer protection."
            color="emerald"
          />
          <FeatureCard
            icon={<CheckCircle className="w-6 h-6 text-indigo-500" />}
            title="Look Professional"
            desc="Branded proposal pages that build trust and close deals faster."
            color="indigo"
          />
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Step number="1" title="Fill the Form" desc="Enter project details, pricing, and timeline." />
            <Step number="2" title="Send the Link" desc="Share the generated proposal page with your client." />
            <Step number="3" title="Get Paid" desc="Client pays the deposit instantly via PayPal." />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white/50 backdrop-blur-sm py-8 text-center text-gray-400 text-sm">
        © 2026 PropGen. Built for freelancers who want to get paid.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color }: { icon: React.ReactNode; title: string; desc: string; color: string }) {
  const bgColors: Record<string, string> = {
    amber: "bg-amber-50 border-amber-100",
    emerald: "bg-emerald-50 border-emerald-100",
    indigo: "bg-indigo-50 border-indigo-100",
  };

  return (
    <div className={`p-6 rounded-2xl border ${bgColors[color]} hover:shadow-lg transition-shadow duration-300`}>
      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function Step({ number, title, desc }: { number: string; title: string; desc: string }) {
  return (
    <div className="text-center">
      <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg shadow-indigo-200">
        {number}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm">{desc}</p>
    </div>
  );
}