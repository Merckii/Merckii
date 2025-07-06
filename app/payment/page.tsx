"use client"

import { useState } from "react"
import { PaymentForm } from "@/components/payment/payment-form"
import { PaymentMethods } from "@/components/payment/payment-methods"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, AlertCircle } from "lucide-react"

export default function PaymentPage() {
  const [paymentResult, setPaymentResult] = useState<{
    success: boolean
    message: string
  } | null>(null)

  const handlePaymentSuccess = (data: any) => {
    setPaymentResult({
      success: true,
      message: `Payment of $${data.amount || "0.00"} completed successfully!`,
    })
  }

  const handlePaymentError = (error: string) => {
    setPaymentResult({
      success: false,
      message: error,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Center</h1>
          <p className="text-gray-600">Manage your payments and payment methods</p>
        </div>

        {paymentResult && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className={`flex items-center gap-2 ${paymentResult.success ? "text-green-600" : "text-red-600"}`}>
                {paymentResult.success ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                <span className="font-medium">{paymentResult.message}</span>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Make a Payment</h2>
            <PaymentForm amount={29.99} currency="USD" onSuccess={handlePaymentSuccess} onError={handlePaymentError} />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Your Payment Methods</h2>
            <PaymentMethods />
          </div>
        </div>
      </div>
    </div>
  )
}
