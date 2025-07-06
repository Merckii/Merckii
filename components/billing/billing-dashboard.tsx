"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, FileText, DollarSign, Calendar, Download, Eye, CheckCircle, XCircle, Clock } from "lucide-react"

interface BillingSummary {
  unpaidInvoices: number
  unpaidAmount: number
  totalPaid: number
  paymentCount: number
  activeBillingCycles: number
  monthlyRecurring: number
}

interface PaymentRecord {
  id: number
  amount: number
  payment_method: string
  payment_status: string
  transaction_id?: string
  payment_date?: string
  notes?: string
  created_at: string
}

interface Invoice {
  id: number
  invoice_number: string
  status: string
  due_date: string
  total_amount: number
  created_at: string
}

export function BillingDashboard() {
  const [summary, setSummary] = useState<BillingSummary>({
    unpaidInvoices: 0,
    unpaidAmount: 0,
    totalPaid: 0,
    paymentCount: 0,
    activeBillingCycles: 0,
    monthlyRecurring: 0,
  })
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBillingData()
  }, [])

  const fetchBillingData = async () => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) return

      const [summaryRes, paymentsRes, invoicesRes] = await Promise.all([
        fetch("/api/billing/summary", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/payments/history", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/invoices/list", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      if (summaryRes.ok) {
        const data = await summaryRes.json()
        setSummary(data.summary)
      }

      if (paymentsRes.ok) {
        const data = await paymentsRes.json()
        setPayments(data.payments || [])
      }

      if (invoicesRes.ok) {
        const data = await invoicesRes.json()
        setInvoices(data.invoices || [])
      }
    } catch (error) {
      console.error("Failed to fetch billing data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "pending":
      case "unpaid":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "paid":
        return "default"
      case "failed":
        return "destructive"
      case "pending":
      case "unpaid":
        return "secondary"
      default:
        return "outline"
    }
  }

  const viewInvoice = (invoiceId: number) => {
    const token = localStorage.getItem("authToken")
    window.open(`/api/invoices/generate?id=${invoiceId}&format=html`, "_blank")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div>Loading billing information...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Payments</h1>
          <p className="text-gray-600">Manage your invoices, payments, and billing information</p>
        </div>

        {/* Billing Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unpaid Invoices</p>
                  <p className="text-2xl font-bold text-gray-900">{summary.unpaidInvoices}</p>
                  <p className="text-sm text-red-600">${summary.unpaidAmount.toFixed(2)}</p>
                </div>
                <FileText className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Paid</p>
                  <p className="text-2xl font-bold text-gray-900">${summary.totalPaid.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">{summary.paymentCount} payments</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Recurring</p>
                  <p className="text-2xl font-bold text-gray-900">${summary.monthlyRecurring.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">{summary.activeBillingCycles} active cycles</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Payment Methods</p>
                  <p className="text-2xl font-bold text-gray-900">2</p>
                  <p className="text-sm text-gray-500">Active methods</p>
                </div>
                <CreditCard className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Invoices and Payments */}
        <Tabs defaultValue="invoices" className="space-y-6">
          <TabsList>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="payments">Payment History</TabsTrigger>
          </TabsList>

          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Recent Invoices
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No invoices found</p>
                  ) : (
                    invoices.map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(invoice.status)}
                          <div>
                            <p className="font-medium">{invoice.invoice_number}</p>
                            <p className="text-sm text-gray-600">
                              Due: {new Date(invoice.due_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="font-medium">${invoice.total_amount.toFixed(2)}</p>
                            <Badge variant={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => viewInvoice(invoice.id)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payments.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No payment records found</p>
                  ) : (
                    payments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(payment.payment_status)}
                          <div>
                            <p className="font-medium">${payment.amount.toFixed(2)}</p>
                            <p className="text-sm text-gray-600">
                              {payment.payment_method.replace("_", " ").toUpperCase()}
                            </p>
                            {payment.transaction_id && (
                              <p className="text-xs text-gray-500">ID: {payment.transaction_id}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            {payment.payment_date
                              ? new Date(payment.payment_date).toLocaleDateString()
                              : new Date(payment.created_at).toLocaleDateString()}
                          </p>
                          <Badge variant={getStatusColor(payment.payment_status)}>{payment.payment_status}</Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
