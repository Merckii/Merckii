"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Search, Eye, Mail, Phone, Calendar, DollarSign, Globe, Server, FileText, Activity } from "lucide-react"

interface Client {
  id: number
  email: string
  full_name: string
  company_name?: string
  phone?: string
  plan_type: string
  created_at: string
  last_login?: string
  total_spent: number
  total_orders: number
  active_domains: number
  active_hosting: number
  status: "active" | "inactive" | "suspended"
}

interface ClientDetails {
  user: Client
  domains: Array<{
    id: number
    domain_name: string
    extension: string
    status: string
    expiration_date: string
    auto_renew: boolean
    price: number
  }>
  hosting: Array<{
    id: number
    plan_name: string
    plan_type: string
    disk_space_gb: number
    bandwidth_gb: number
    status: string
    expiration_date: string
    price: number
    disk_used: number
    bandwidth_used: number
  }>
  invoices: Array<{
    id: number
    invoice_number: string
    total_amount: number
    status: string
    due_date: string
    created_at: string
  }>
}

export function ClientManagement() {
  const [clients, setClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedClient, setSelectedClient] = useState<ClientDetails | null>(null)
  const [clientDetailsLoading, setClientDetailsLoading] = useState(false)

  // Mock data for demonstration
  const mockClients: Client[] = [
    {
      id: 1,
      email: "john.doe@example.com",
      full_name: "John Doe",
      company_name: "Tech Solutions Inc",
      phone: "+1-555-0123",
      plan_type: "business",
      created_at: "2023-01-15T10:30:00Z",
      last_login: "2024-01-05T14:22:00Z",
      total_spent: 1250.0,
      total_orders: 8,
      active_domains: 3,
      active_hosting: 2,
      status: "active",
    },
    {
      id: 2,
      email: "jane.smith@example.com",
      full_name: "Jane Smith",
      company_name: "Creative Agency",
      phone: "+1-555-0456",
      plan_type: "premium",
      created_at: "2023-03-22T09:15:00Z",
      last_login: "2024-01-04T11:45:00Z",
      total_spent: 2100.0,
      total_orders: 12,
      active_domains: 5,
      active_hosting: 3,
      status: "active",
    },
    {
      id: 3,
      email: "mike.johnson@example.com",
      full_name: "Mike Johnson",
      company_name: null,
      phone: "+1-555-0789",
      plan_type: "starter",
      created_at: "2023-06-10T16:20:00Z",
      last_login: "2023-12-28T09:30:00Z",
      total_spent: 450.0,
      total_orders: 3,
      active_domains: 1,
      active_hosting: 1,
      status: "active",
    },
    {
      id: 4,
      email: "sarah.wilson@example.com",
      full_name: "Sarah Wilson",
      company_name: "E-commerce Store",
      phone: "+1-555-0321",
      plan_type: "business",
      created_at: "2023-08-05T12:45:00Z",
      last_login: "2024-01-03T16:10:00Z",
      total_spent: 890.0,
      total_orders: 6,
      active_domains: 2,
      active_hosting: 1,
      status: "active",
    },
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setClients(mockClients)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredClients = clients.filter(
    (client) =>
      client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.company_name && client.company_name.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const loadClientDetails = async (clientId: number) => {
    setClientDetailsLoading(true)

    // Mock client details data
    const mockDetails: ClientDetails = {
      user: mockClients.find((c) => c.id === clientId)!,
      domains: [
        {
          id: 1,
          domain_name: "example",
          extension: ".com",
          status: "active",
          expiration_date: "2024-12-15",
          auto_renew: true,
          price: 12.99,
        },
        {
          id: 2,
          domain_name: "mysite",
          extension: ".net",
          status: "active",
          expiration_date: "2024-08-22",
          auto_renew: false,
          price: 14.99,
        },
      ],
      hosting: [
        {
          id: 1,
          plan_name: "Business Pro",
          plan_type: "business",
          disk_space_gb: 100,
          bandwidth_gb: 1000,
          status: "active",
          expiration_date: "2024-06-15",
          price: 29.99,
          disk_used: 45,
          bandwidth_used: 320,
        },
      ],
      invoices: [
        {
          id: 1,
          invoice_number: "INV-2024-001",
          total_amount: 42.98,
          status: "paid",
          due_date: "2024-01-15",
          created_at: "2024-01-01",
        },
        {
          id: 2,
          invoice_number: "INV-2023-045",
          total_amount: 29.99,
          status: "paid",
          due_date: "2023-12-15",
          created_at: "2023-12-01",
        },
      ],
    }

    setTimeout(() => {
      setSelectedClient(mockDetails)
      setClientDetailsLoading(false)
    }, 500)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Client Management</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading clients...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Domains</TableHead>
                  <TableHead>Hosting</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{client.full_name}</div>
                        <div className="text-sm text-gray-500">{client.email}</div>
                        {client.company_name && <div className="text-sm text-gray-400">{client.company_name}</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {client.plan_type}
                      </Badge>
                    </TableCell>
                    <TableCell>{client.active_domains}</TableCell>
                    <TableCell>{client.active_hosting}</TableCell>
                    <TableCell>{formatCurrency(client.total_spent)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(client.status)}>{client.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => loadClientDetails(client.id)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Client Details</DialogTitle>
                          </DialogHeader>

                          {clientDetailsLoading ? (
                            <div className="text-center py-8">Loading client details...</div>
                          ) : selectedClient ? (
                            <Tabs defaultValue="overview" className="w-full">
                              <TabsList className="grid w-full grid-cols-5">
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
                                    <CardContent className="space-y-3">
                                      <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-gray-500" />
                                        <span>{selectedClient.user.email}</span>
                                      </div>
                                      {selectedClient.user.phone && (
                                        <div className="flex items-center gap-2">
                                          <Phone className="h-4 w-4 text-gray-500" />
                                          <span>{selectedClient.user.phone}</span>
                                        </div>
                                      )}
                                      <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        <span>Joined {formatDate(selectedClient.user.created_at)}</span>
                                      </div>
                                      {selectedClient.user.last_login && (
                                        <div className="flex items-center gap-2">
                                          <Activity className="h-4 w-4 text-gray-500" />
                                          <span>Last login {formatDate(selectedClient.user.last_login)}</span>
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>

                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Account Statistics</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <DollarSign className="h-4 w-4 text-green-500" />
                                          <span>Total Spent</span>
                                        </div>
                                        <span className="font-medium">
                                          {formatCurrency(selectedClient.user.total_spent)}
                                        </span>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <FileText className="h-4 w-4 text-blue-500" />
                                          <span>Total Orders</span>
                                        </div>
                                        <span className="font-medium">{selectedClient.user.total_orders}</span>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <Globe className="h-4 w-4 text-purple-500" />
                                          <span>Active Domains</span>
                                        </div>
                                        <span className="font-medium">{selectedClient.user.active_domains}</span>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <Server className="h-4 w-4 text-orange-500" />
                                          <span>Hosting Accounts</span>
                                        </div>
                                        <span className="font-medium">{selectedClient.user.active_hosting}</span>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              </TabsContent>

                              <TabsContent value="domains" className="space-y-4">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Domain</TableHead>
                                      <TableHead>Status</TableHead>
                                      <TableHead>Expires</TableHead>
                                      <TableHead>Auto Renew</TableHead>
                                      <TableHead>Price</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {selectedClient.domains.map((domain) => (
                                      <TableRow key={domain.id}>
                                        <TableCell className="font-medium">
                                          {domain.domain_name}
                                          {domain.extension}
                                        </TableCell>
                                        <TableCell>
                                          <Badge className={getStatusColor(domain.status)}>{domain.status}</Badge>
                                        </TableCell>
                                        <TableCell>{formatDate(domain.expiration_date)}</TableCell>
                                        <TableCell>
                                          <Badge variant={domain.auto_renew ? "default" : "secondary"}>
                                            {domain.auto_renew ? "Yes" : "No"}
                                          </Badge>
                                        </TableCell>
                                        <TableCell>{formatCurrency(domain.price)}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TabsContent>

                              <TabsContent value="hosting" className="space-y-4">
                                {selectedClient.hosting.map((hosting) => (
                                  <Card key={hosting.id}>
                                    <CardHeader>
                                      <CardTitle className="text-lg">{hosting.plan_name}</CardTitle>
                                      <Badge className={getStatusColor(hosting.status)}>{hosting.status}</Badge>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <div className="flex justify-between text-sm mb-1">
                                            <span>Disk Usage</span>
                                            <span>
                                              {hosting.disk_used}GB / {hosting.disk_space_gb}GB
                                            </span>
                                          </div>
                                          <Progress value={(hosting.disk_used / hosting.disk_space_gb) * 100} />
                                        </div>
                                        <div>
                                          <div className="flex justify-between text-sm mb-1">
                                            <span>Bandwidth Usage</span>
                                            <span>
                                              {hosting.bandwidth_used}GB / {hosting.bandwidth_gb}GB
                                            </span>
                                          </div>
                                          <Progress value={(hosting.bandwidth_used / hosting.bandwidth_gb!) * 100} />
                                        </div>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span>Expires: {formatDate(hosting.expiration_date)}</span>
                                        <span className="font-medium">{formatCurrency(hosting.price)}/month</span>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </TabsContent>

                              <TabsContent value="invoices" className="space-y-4">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Invoice #</TableHead>
                                      <TableHead>Amount</TableHead>
                                      <TableHead>Status</TableHead>
                                      <TableHead>Due Date</TableHead>
                                      <TableHead>Created</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {selectedClient.invoices.map((invoice) => (
                                      <TableRow key={invoice.id}>
                                        <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                                        <TableCell>{formatCurrency(invoice.total_amount)}</TableCell>
                                        <TableCell>
                                          <Badge
                                            className={
                                              invoice.status === "paid"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-yellow-100 text-yellow-800"
                                            }
                                          >
                                            {invoice.status}
                                          </Badge>
                                        </TableCell>
                                        <TableCell>{formatDate(invoice.due_date)}</TableCell>
                                        <TableCell>{formatDate(invoice.created_at)}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TabsContent>

                              <TabsContent value="activity" className="space-y-4">
                                <div className="text-center py-8 text-gray-500">
                                  Activity log will be implemented here
                                </div>
                              </TabsContent>
                            </Tabs>
                          ) : null}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
