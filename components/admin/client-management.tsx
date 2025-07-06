"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Users,
  Eye,
  Mail,
  Calendar,
  Globe,
  Server,
  FileText,
  CreditCard,
  Activity,
  Loader2,
} from "lucide-react"

interface Client {
  id: number
  name: string
  email: string
  company?: string
  status: string
  created_at: string
  domain_count: number
  hosting_count: number
  order_count: number
  total_spent: number
}

interface ClientDetails {
  client: Client
  domains: any[]
  hosting: any[]
  invoices: any[]
  orders: any[]
  payments: any[]
}

export function ClientManagement() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClient, setSelectedClient] = useState<ClientDetails | null>(null)
  const [clientDetailsLoading, setClientDetailsLoading] = useState(false)
  const [showClientDialog, setShowClientDialog] = useState(false)

  useEffect(() => {
    fetchClients()
  }, [searchTerm])

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const url = searchTerm ? `/api/admin/clients?search=${encodeURIComponent(searchTerm)}` : "/api/admin/clients"

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setClients(data.clients || [])
      }
    } catch (error) {
      console.error("Failed to fetch clients:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchClientDetails = async (clientId: number) => {
    setClientDetailsLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch(`/api/admin/clients/${clientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setSelectedClient(data)
        setShowClientDialog(true)
      }
    } catch (error) {
      console.error("Failed to fetch client details:", error)
    } finally {
      setClientDetailsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "suspended":
        return "destructive"
      case "pending":
        return "secondary"
      default:
        return "outline"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Client Management</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Clients ({clients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clients.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No clients found</div>
            ) : (
              clients.map((client) => (
                <div
                  key={client.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{client.name}</h3>
                        <Badge variant={getStatusColor(client.status)}>{client.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{client.email}</p>
                      {client.company && <p className="text-sm text-gray-500">{client.company}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <div className="font-medium">{client.domain_count}</div>
                      <div className="text-gray-500">Domains</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{client.hosting_count}</div>
                      <div className="text-gray-500">Hosting</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{formatCurrency(client.total_spent)}</div>
                      <div className="text-gray-500">Total Spent</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{formatDate(client.created_at)}</div>
                      <div className="text-gray-500">Joined</div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => fetchClientDetails(client.id)}
                      disabled={clientDetailsLoading}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Client Details Dialog */}
      <Dialog open={showClientDialog} onOpenChange={setShowClientDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Client Details
            </DialogTitle>
          </DialogHeader>

          {selectedClient && (
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="domains">Domains</TabsTrigger>
                <TabsTrigger value="hosting">Hosting</TabsTrigger>
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{selectedClient.client.email}</span>
                      </div>
                      {selectedClient.client.company && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Company:</span>
                          <span>{selectedClient.client.company}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>Joined {formatDate(selectedClient.client.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusColor(selectedClient.client.status)}>
                          {selectedClient.client.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Account Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-blue-600" />
                          <span>Domains</span>
                        </div>
                        <span className="font-medium">{selectedClient.domains.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Server className="h-4 w-4 text-green-600" />
                          <span>Hosting Accounts</span>
                        </div>
                        <span className="font-medium">{selectedClient.hosting.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-purple-600" />
                          <span>Total Orders</span>
                        </div>
                        <span className="font-medium">{selectedClient.orders.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-orange-600" />
                          <span>Total Spent</span>
                        </div>
                        <span className="font-medium">
                          {formatCurrency(selectedClient.payments.reduce((sum, p) => sum + p.amount, 0))}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="domains" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Domain Portfolio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedClient.domains.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No domains registered</p>
                    ) : (
                      <div className="space-y-3">
                        {selectedClient.domains.map((domain, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium">
                                {domain.domain_name}
                                {domain.extension}
                              </div>
                              <div className="text-sm text-gray-500">Expires: {formatDate(domain.expiration_date)}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={getStatusColor(domain.status)}>{domain.status}</Badge>
                              {domain.auto_renew && (
                                <Badge variant="outline" className="text-xs">
                                  Auto-Renew
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="hosting" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Hosting Accounts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedClient.hosting.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No hosting accounts</p>
                    ) : (
                      <div className="space-y-4">
                        {selectedClient.hosting.map((host, index) => (
                          <div key={index} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h3 className="font-medium">{host.plan_name}</h3>
                                <p className="text-sm text-gray-500">Created: {formatDate(host.created_at)}</p>
                              </div>
                              <Badge variant={getStatusColor(host.status)}>{host.status}</Badge>
                            </div>

                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Disk Usage</span>
                                  <span>{host.disk_usage}%</span>
                                </div>
                                <Progress value={host.disk_usage} className="h-2" />
                              </div>

                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Bandwidth Usage</span>
                                  <span>{host.bandwidth_usage}%</span>
                                </div>
                                <Progress value={host.bandwidth_usage} className="h-2" />
                              </div>

                              <div className="flex justify-between text-sm">
                                <span>Email Accounts</span>
                                <span>{host.email_accounts}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="invoices" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Invoices</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedClient.invoices.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No invoices found</p>
                    ) : (
                      <div className="space-y-3">
                        {selectedClient.invoices.map((invoice, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium">{invoice.invoice_number}</div>
                              <div className="text-sm text-gray-500">Due: {formatDate(invoice.due_date)}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{formatCurrency(invoice.total_amount)}</div>
                              <Badge variant={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedClient.orders.map((order, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className="bg-blue-100 p-2 rounded-full">
                            {order.order_type === "domain" ? (
                              <Globe className="h-4 w-4 text-blue-600" />
                            ) : (
                              <Server className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">
                              {order.order_type === "domain" ? "Domain Registration" : "Hosting Purchase"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.item_name} - {formatCurrency(order.amount)}
                            </div>
                            <div className="text-xs text-gray-400">{formatDate(order.created_at)}</div>
                          </div>
                          <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
