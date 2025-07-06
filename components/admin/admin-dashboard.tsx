import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Users, Globe, Server, TrendingUp, AlertCircle, Settings, BarChart3 } from "lucide-react"

const stats = [
  {
    title: "Total Revenue",
    value: "$24,580",
    change: "+12.5%",
    icon: DollarSign,
    color: "text-green-600",
  },
  {
    title: "Active Customers",
    value: "1,247",
    change: "+8.2%",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Domains Registered",
    value: "3,456",
    change: "+15.3%",
    icon: Globe,
    color: "text-purple-600",
  },
  {
    title: "Hosting Accounts",
    value: "892",
    change: "+6.7%",
    icon: Server,
    color: "text-orange-600",
  },
]

const recentOrders = [
  { id: "#12345", customer: "John Doe", service: "Premium Hosting", amount: "$14.99", status: "Active" },
  { id: "#12346", customer: "Jane Smith", service: "Domain Registration", amount: "$12.99", status: "Pending" },
  { id: "#12347", customer: "Mike Johnson", service: "Business Hosting", amount: "$7.99", status: "Active" },
  { id: "#12348", customer: "Sarah Wilson", service: "SSL Certificate", amount: "$49.99", status: "Active" },
]

const upcomingRenewals = [
  { domain: "example.com", customer: "TechCorp", expires: "2024-01-15", amount: "$12.99" },
  { domain: "mysite.net", customer: "WebStudio", expires: "2024-01-18", amount: "$14.99" },
  { domain: "business.org", customer: "StartupInc", expires: "2024-01-22", amount: "$13.99" },
]

export function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your hosting business and monitor performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className={`text-sm ${stat.color} flex items-center gap-1`}>
                      <TrendingUp className="h-4 w-4" />
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg bg-gray-100`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Orders
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-gray-600">{order.customer}</p>
                      <p className="text-sm text-gray-500">{order.service}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{order.amount}</p>
                      <Badge variant={order.status === "Active" ? "default" : "secondary"}>{order.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Renewals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Upcoming Renewals
                <AlertCircle className="h-5 w-5 text-orange-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingRenewals.map((renewal, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{renewal.domain}</p>
                      <p className="text-sm text-gray-600">{renewal.customer}</p>
                      <p className="text-sm text-orange-600">Expires: {renewal.expires}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{renewal.amount}</p>
                      <Button size="sm" variant="outline">
                        Remind
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Button className="flex flex-col items-center gap-2 h-20">
                <Users className="h-6 w-6" />
                <span className="text-sm">Manage Users</span>
              </Button>
              <Button className="flex flex-col items-center gap-2 h-20" variant="outline">
                <Globe className="h-6 w-6" />
                <span className="text-sm">Domain Tools</span>
              </Button>
              <Button className="flex flex-col items-center gap-2 h-20" variant="outline">
                <Server className="h-6 w-6" />
                <span className="text-sm">Server Status</span>
              </Button>
              <Button className="flex flex-col items-center gap-2 h-20" variant="outline">
                <BarChart3 className="h-6 w-6" />
                <span className="text-sm">Analytics</span>
              </Button>
              <Button className="flex flex-col items-center gap-2 h-20" variant="outline">
                <DollarSign className="h-6 w-6" />
                <span className="text-sm">Billing</span>
              </Button>
              <Button className="flex flex-col items-center gap-2 h-20" variant="outline">
                <Settings className="h-6 w-6" />
                <span className="text-sm">Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
