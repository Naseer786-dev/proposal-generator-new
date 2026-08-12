import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-2">
          <FileText className="w-8 h-8" />
          <h1 className="text-3xl font-bold">PropGen</h1>
        </div>
        <p className="text-gray-500 max-w-md">
          Create professional project proposals with integrated Stripe payments in minutes.
        </p>
        <Link href="/wizard">
          <Button size="lg">Create Your First Proposal</Button>
        </Link>
      </div>
    </div>
  )
}
