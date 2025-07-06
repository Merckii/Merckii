import { type NextRequest, NextResponse } from "next/server"
import { getDashboardStats, getDomainsByUserId, getHostingAccountsByUserId, getOrdersByUserId } from "@/lib/db-queries"
import { getInvoicesByUserId } from "@/lib/invoice-generator"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any

    // Get user-specific stats
    const [domains, hostingAccounts, orders, invoices] = await Promise.all([
      getDomainsByUserId(decoded.userId),
      getHostingAccountsByUserId(decoded.userId),
      getOrdersByUserId(decoded.userId),
      getInvoicesByUserId(decoded.userId),
    ])

    // Calculate stats
    const activeDomains = domains.filter((d) => d.status === "active").length
    const activeHosting = hostingAccounts.filter((h) => h.status === "active").length
    const totalOrders = orders.length
    const unpaidInvoices = invoices.filter((i) => i.payment_status === "unpaid").length

    // If admin, get global stats
    let globalStats = null
    if (decoded.isAdmin) {
      globalStats = await getDashboardStats()
    }

    const stats = {
      activeDomains,
      activeHosting,
      totalOrders,
      unpaidInvoices,
      ...(globalStats && { global: globalStats }),
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
