"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface TestResult {
  success: boolean
  message: string
  order?: any
  invoice?: any
  paymentRecord?: any
  error?: string
}

export function TestOrderButton() {
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState<TestResult | null>(null)

  const runTest = async () => {
    setTesting(true)
    setResult(null)

    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        setResult({
          success: false,
          message: "No authentication token found. Please log in first.",
        })
        return
      }

      const response = await fetch("/api/orders/test", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: "Test order created successfully!",
          order: data.order,
          invoice: data.invoice,
          paymentRecord: data.paymentRecord,
        })
      } else {
        setResult({
          success: false,
          message: data.error || "Failed to create test order",
          error: data.details,
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Network error occurred",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setTesting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Test Order Creation
          {result?.success && <CheckCircle className="h-5 w-5 text-green-600" />}
          {result?.success === false && <AlertCircle className="h-5 w-5 text-red-600" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600">
          This will create a test order with a domain and hosting plan, generate an invoice, and record a test payment
          to verify the complete billing flow.
        </p>

        <Button onClick={runTest} disabled={testing} className="w-full">
          {testing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Test Order...
            </>
          ) : (
            "Run Test Order"
          )}
        </Button>

        {result && (
          <div
            className={`p-4 rounded-lg border ${
              result.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              <span className={`font-medium ${result.success ? "text-green-800" : "text-red-800"}`}>
                {result.message}
              </span>
            </div>

            {result.success && result.order && (
              <div className="space-y-2 mt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Order Number:</span>
                    <Badge variant="outline" className="ml-2">
                      {result.order.order_number}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Total Amount:</span>
                    <span className="ml-2">${result.order.total_amount}</span>
                  </div>
                </div>

                {result.invoice && (
                  <div className="text-sm">
                    <span className="font-medium">Invoice:</span>
                    <Badge variant="outline" className="ml-2">
                      {result.invoice.invoice_number}
                    </Badge>
                  </div>
                )}

                {result.paymentRecord && (
                  <div className="text-sm">
                    <span className="font-medium">Payment Status:</span>
                    <Badge variant="default" className="ml-2">
                      {result.paymentRecord.payment_status}
                    </Badge>
                  </div>
                )}
              </div>
            )}

            {result.error && (
              <div className="mt-2 text-sm text-red-700">
                <span className="font-medium">Error Details:</span>
                <pre className="mt-1 text-xs bg-red-100 p-2 rounded overflow-auto">{result.error}</pre>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
