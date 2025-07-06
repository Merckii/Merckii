"use client"

import { TestOrderButton } from "@/components/test-order-button"

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">System Testing</h1>
          <p className="text-gray-600">Test the complete order and billing flow</p>
        </div>

        <div className="flex justify-center">
          <TestOrderButton />
        </div>
      </div>
    </div>
  )
}
