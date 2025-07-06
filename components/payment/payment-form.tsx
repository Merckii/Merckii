"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, DollarSign, Bitcoin, Loader2 } from "lucide-react"

interface PaymentFormProps {
  amount: number
  currency?: string
  onSuccess?: (paymentData: any) => void
  onError?: (error: string) => void
}

export function PaymentForm({ amount, currency = "USD", onSuccess, onError }: PaymentFormProps) {
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("stripe")
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  })

  const handlePayment = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("Authentication required")
      }

      // Create payment intent
      const intentResponse = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          currency,
          paymentMethod,
        }),
      })

      const intentData = await intentResponse.json()

      if (!intentResponse.ok) {
        throw new Error(intentData.error || "Failed to create payment")
      }

      // Handle different payment methods
      switch (paymentMethod) {
        case "stripe":
          await handleStripePayment(intentData)
          break
        case "paypal":
          await handlePayPalPayment(intentData)
          break
        case "binance":
          await handleBinancePayment(intentData)
          break
        default:
          throw new Error("Unsupported payment method")
      }
    } catch (error) {
      console.error("Payment error:", error)
      onError?.(error instanceof Error ? error.message : "Payment failed")
    } finally {
      setLoading(false)
    }
  }

  const handleStripePayment = async (intentData: any) => {
    // In a real implementation, you would use Stripe Elements here
    // For demo purposes, we'll simulate the payment
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const captureResponse = await fetch("/api/payments/capture", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentMethod: "stripe",
        paymentId: intentData.paymentIntentId,
        amount,
      }),
    })

    const captureData = await captureResponse.json()
    if (captureResponse.ok) {
      onSuccess?.(captureData)
    } else {
      throw new Error(captureData.error)
    }
  }

  const handlePayPalPayment = async (intentData: any) => {
    // Redirect to PayPal for approval
    if (intentData.approvalUrl) {
      window.location.href = intentData.approvalUrl
    } else {
      throw new Error("PayPal approval URL not received")
    }
  }

  const handleBinancePayment = async (intentData: any) => {
    // Redirect to Binance Pay checkout
    if (intentData.checkoutUrl) {
      window.location.href = intentData.checkoutUrl
    } else {
      throw new Error("Binance checkout URL not received")
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Payment - ${amount.toFixed(2)} {currency}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stripe" className="flex items-center gap-1">
              <CreditCard className="h-4 w-4" />
              Card
            </TabsTrigger>
            <TabsTrigger value="paypal">PayPal</TabsTrigger>
            <TabsTrigger value="binance" className="flex items-center gap-1">
              <Bitcoin className="h-4 w-4" />
              Crypto
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stripe" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input
                id="cardName"
                placeholder="John Doe"
                value={cardData.name}
                onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardData.number}
                onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={cardData.expiry}
                  onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  placeholder="123"
                  value={cardData.cvc}
                  onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="paypal" className="space-y-4">
            <div className="text-center py-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">PayPal Payment</h3>
                <p className="text-blue-700 text-sm">
                  You will be redirected to PayPal to complete your payment securely.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="binance" className="space-y-4">
            <div className="text-center py-8">
              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="font-semibold text-yellow-900 mb-2">Binance Pay</h3>
                <p className="text-yellow-700 text-sm mb-4">
                  Pay with cryptocurrency through Binance Pay. Supported currencies: USDT, BTC, ETH, BNB.
                </p>
                <Select defaultValue="USDT">
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USDT">USDT</SelectItem>
                    <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                    <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                    <SelectItem value="BNB">Binance Coin (BNB)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Button onClick={handlePayment} disabled={loading} className="w-full mt-6">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay $${amount.toFixed(2)} ${currency}`
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
