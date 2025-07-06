"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Globe, Server, Shield, Calendar, Settings, CreditCard, FileText, HelpCircle } from "lucide-react"

const domains = [
  { name: "mywebsite.com", status: "Active", expires: "2024-12-15", autoRenew: true },
  { name: "mybusiness.net", status: "Active", expires: "2024-11-22", autoRenew: false },
  { name: "mystore.org", status: "Pending", expires: "2024-10-30", autoRenew: true },
]

const hostingAccounts = [
  { name: "Business Plan", domain: "mywebsite.com", status: "Active", usage: "45%" },
  { name: "Premium Plan", domain: "mybusiness.net", status: "Active", usage: "78%" },
]

const recentInvoices = [
  { id: "INV-001", service: "Domain Renewal", amount: "$12.99", date: "2024-01-01", status: "Paid" },
  { id: "INV-002", service: "Hosting Plan", amount: "$7.99", date: "2024-01-15", status: "Paid" },
  { id: "INV-003", service: "SSL Certificate", amount: "$49.99", date: "2024-01-20", status: "Pending" },
]

export function CustomerDashboard() {
  const [stats, setStats] = useState({
    activeDomains: 0,
    activeHosting: 0,
    totalOrders: 0,
    unpaidInvoices: 0,
  })
  const [domains, setDomains] = useState([])
  const [hostingAccounts, setHostingAccounts] = useState([])
  const [recentInvoices, setRecentInvoices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) return

      const response = await fetch("/api/dashboard/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div>Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
          <p className="text-gray-600">Manage your domains, hosting, and account settings</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Domains</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeDomains}</p>
                </div>
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Hosting Plans</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeHosting}</p>
                </div>
                <Server className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unpaid Invoices</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.unpaidInvoices}</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Domains */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                My Domains
                <Button variant="outline" size="sm">
                  Add Domain
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {domains.map((domain, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{domain.name}</p>
                      <p className="text-sm text-gray-600">Expires: {domain.expires}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={domain.status === "Active" ? "default" : "secondary"}>{domain.status}</Badge>
                        {domain.autoRenew && (
                          <Badge variant="outline" className="text-xs">
                            Auto-Renew
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Manage
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Hosting */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Hosting Accounts
                <Button variant="outline" size="sm">
                  Add Hosting
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hostingAccounts.map((account, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{account.name}</p>
                      <Badge variant="default">{account.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{account.domain}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Storage Usage</span>
                          <span>{account.usage}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: account.usage }}></div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="ml-4">
                        Manage
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Invoices */}
        <Card className="mb-8">
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
              {recentInvoices.map((invoice, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{invoice.id}</p>
                    <p className="text-sm text-gray-600">{invoice.service}</p>
                    <p className="text-sm text-gray-500">{invoice.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{invoice.amount}</p>
                    <Badge variant={invoice.status === "Paid" ? "default" : "secondary"}>{invoice.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="flex flex-col items-center gap-2 h-20" variant="outline">
                <Settings className="h-6 w-6" />
                <span className="text-sm">Account Settings</span>
              </Button>
              <Button className="flex flex-col items-center gap-2 h-20" variant="outline">
                <CreditCard className="h-6 w-6" />
                <span className="text-sm">Billing</span>
              </Button>
              <Button className="flex flex-col items-center gap-2 h-20" variant="outline">
                <FileText className="h-6 w-6" />
                <span className="text-sm">Documentation</span>
              </Button>
              <Button className="flex flex-col items-center gap-2 h-20" variant="outline">
                <HelpCircle className="h-6 w-6" />
                <span className="text-sm">Support</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
