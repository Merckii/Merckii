"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CreditCard, Plus, Trash2, Star, Bitcoin } from "lucide-react"
import { PaymentForm } from "./payment-form"

interface PaymentMethod {
  id: number
  payment_type: string
  last_four?: string
  brand?: string
  exp_month?: number
  exp_year?: number
  is_default: boolean
  created_at: string
}

export function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)

  useEffect(() => {
    fetchPaymentMethods()
  }, [])

  const fetchPaymentMethods = async () => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) return

      const response = await fetch("/api/payments/methods", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setPaymentMethods(data.paymentMethods || [])
      }
    } catch (error) {
      console.error("Failed to fetch payment methods:", error)
    } finally {
      setLoading(false)
    }
  }

  const removePaymentMethod = async (methodId: number) => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) return

      const response = await fetch(`/api/payments/methods?id=${methodId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        setPaymentMethods((methods) => methods.filter((m) => m.id !== methodId))
      }
    } catch (error) {
      console.error("Failed to remove payment method:", error)
    }
  }

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case "credit_card":
        return <CreditCard className="h-5 w-5 text-blue-600" />
      case "paypal":
        return (
          <div className="h-5 w-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
            P
          </div>
        )
      case "binance":
        return <Bitcoin className="h-5 w-5 text-yellow-600" />
      default:
        return <CreditCard className="h-5 w-5 text-gray-400" />
    }
  }

  const formatPaymentMethod = (method: PaymentMethod) => {
    switch (method.payment_type) {
      case "credit_card":
        return `•••• ${method.last_four} (${method.brand?.toUpperCase()}) ${method.exp_month}/${method.exp_year}`
      case "paypal":
        return "PayPal Account"
      case "binance":
        return "Binance Pay"
      default:
        return method.payment_type.replace("_", " ").toUpperCase()
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading payment methods...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Methods
          </span>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                Add Method
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Payment Method</DialogTitle>
              </DialogHeader>
              <PaymentForm
                amount={0}
                onSuccess={() => {
                  setShowAddDialog(false)
                  fetchPaymentMethods()
                }}
                onError={(error) => {
                  console.error("Payment method error:", error)
                }}
              />
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {paymentMethods.length > 0 ? (
            paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getPaymentIcon(method.payment_type)}
                  <div>
                    <p className="font-medium">{formatPaymentMethod(method)}</p>
                    <p className="text-sm text-gray-600">Added {new Date(method.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {method.is_default && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      Default
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => removePaymentMethod(method.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              <CreditCard className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No payment methods added</p>
              <p className="text-sm">Add a payment method to get started</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
