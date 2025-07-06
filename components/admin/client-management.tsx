"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, CreditCard, FileText, Search, Eye, Edit, Plus, Mail, Phone, Calendar } from "lucide-react"

interface Client {
  id: number
  email: string
  firstName: string
  lastName: string
  phone?: string
  status: "active" | "inactive" | "suspended"
  createdAt: string
  lastLogin?: string
  totalOrders: number
  totalSpent: number
  domains: Domain[]
  hostingAccounts: HostingAccount[]
  invoices: Invoice[]
}

interface Domain {
  id: number
  name: string
  status: "active" | "expired" | "pending"
  registeredAt: string
  expiresAt: string
  autoRenew: boolean
}

interface HostingAccount {
  id: number
  planName: string
  domain: string
  status: "active" | "suspended" | "cancelled"
  createdAt: string
  diskUsage: number
  diskLimit: number
  bandwidthUsage: number
  bandwidthLimit: number
}

interface Invoice {
  id: string
  amount: number
  status: "paid" | "pending" | "overdue"
  createdAt: string
  dueDate: string
  description: string
}

export function ClientManagement() {
  const [clients, setClients] = useState<Client[]>([])
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch("/api/admin/clients", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setClients(data.clients)
      }
    } catch (error) {
      console.error("Failed to fetch clients:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchClientDetails = async (clientId: number) => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`/api/admin/clients/${clientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setSelectedClient(data.client)
      }
    } catch (error) {
      console.error("Failed to fetch client details:", error)
    }
  }

  const filteredClients = clients.filter(
    (client) =>
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      case "expired":
        return "bg-orange-100 text-orange-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "paid":
        return "bg-green-100 text-green-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div>Loading clients...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Client Management</h2>
          <p className="text-gray-600">Manage customer accounts and services</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search clients by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Clients ({filteredClients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Domains</TableHead>
                <TableHead>Hosting</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {client.firstName} {client.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{client.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(client.status)}>{client.status}</Badge>
                  </TableCell>
                  <TableCell>{client.domains?.length || 0}</TableCell>
                  <TableCell>{client.hostingAccounts?.length || 0}</TableCell>
                  <TableCell>${client.totalSpent?.toFixed(2) || "0.00"}</TableCell>
                  <TableCell>{client.lastLogin ? new Date(client.lastLogin).toLocaleDateString() : "Never"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => fetchClientDetails(client.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              Client Details - {client.firstName} {client.lastName}
                            </DialogTitle>
                          </DialogHeader>
                          {selectedClient && <ClientDetailsView client={selectedClient} />}
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function ClientDetailsView({ client }: { client: Client }) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="domains">Domains</TabsTrigger>
        <TabsTrigger value="hosting">Hosting</TabsTrigger>
        <TabsTrigger value="invoices">Invoices</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Client Since</p>
                  <p className="font-medium">{new Date(client.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Spent</p>
                  <p className="font-medium">${client.totalSpent?.toFixed(2) || "0.00"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="font-medium">{client.totalOrders || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span>{client.email}</span>
            </div>
            {client.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{client.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>Last login: {client.lastLogin ? new Date(client.lastLogin).toLocaleString() : "Never"}</span>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="domains" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Domains ({client.domains?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {client.domains && client.domains.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Domain</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Auto-Renew</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {client.domains.map((domain) => (
                    <TableRow key={domain.id}>
                      <TableCell className="font-medium">{domain.name}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(domain.status)}>{domain.status}</Badge>
                      </TableCell>
                      <TableCell>{new Date(domain.registeredAt).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(domain.expiresAt).toLocaleDateString()}</TableCell>
                      <TableCell>{domain.autoRenew ? "Yes" : "No"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-gray-500">No domains registered</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="hosting" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Hosting Accounts ({client.hostingAccounts?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {client.hostingAccounts && client.hostingAccounts.length > 0 ? (
              <div className="space-y-4">
                {client.hostingAccounts.map((account) => (
                  <Card key={account.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{account.planName}</h4>
                        <Badge className={getStatusColor(account.status)}>{account.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{account.domain}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Disk Usage</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${(account.diskUsage / account.diskLimit) * 100}%` }}
                              ></div>
                            </div>
                            <span>
                              {account.diskUsage}MB / {account.diskLimit}MB
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-600">Bandwidth Usage</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${(account.bandwidthUsage / account.bandwidthLimit) * 100}%` }}
                              ></div>
                            </div>
                            <span>
                              {account.bandwidthUsage}GB / {account.bandwidthLimit}GB
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No hosting accounts</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="invoices" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Invoices ({client.invoices?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {client.invoices && client.invoices.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {client.invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.description}</TableCell>
                      <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                      </TableCell>
                      <TableCell>{new Date(invoice.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-gray-500">No invoices</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="activity" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Activity log will be displayed here</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800"
    case "inactive":
      return "bg-gray-100 text-gray-800"
    case "suspended":
      return "bg-red-100 text-red-800"
    case "expired":
      return "bg-orange-100 text-orange-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "paid":
      return "bg-green-100 text-green-800"
    case "overdue":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}
