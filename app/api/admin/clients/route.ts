import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import jwt from "jsonwebtoken"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any

    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    // Fetch all clients with their stats
    const clients = await sql`
      SELECT 
        u.id,
        u.email,
        u.first_name,
        u.last_name,
        u.phone,
        u.status,
        u.created_at,
        u.last_login,
        COUNT(DISTINCT o.id) as total_orders,
        COALESCE(SUM(o.total_amount), 0) as total_spent,
        COUNT(DISTINCT d.id) as domain_count,
        COUNT(DISTINCT h.id) as hosting_count
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      LEFT JOIN domains d ON u.id = d.user_id
      LEFT JOIN hosting_accounts h ON u.id = h.user_id
      WHERE u.role = 'user'
      GROUP BY u.id, u.email, u.first_name, u.last_name, u.phone, u.status, u.created_at, u.last_login
      ORDER BY u.created_at DESC
    `

    const formattedClients = clients.map((client) => ({
      id: client.id,
      email: client.email,
      firstName: client.first_name,
      lastName: client.last_name,
      phone: client.phone,
      status: client.status,
      createdAt: client.created_at,
      lastLogin: client.last_login,
      totalOrders: Number.parseInt(client.total_orders),
      totalSpent: Number.parseFloat(client.total_spent),
      domains: [],
      hostingAccounts: [],
      invoices: [],
    }))

    return NextResponse.json({ clients: formattedClients })
  } catch (error) {
    console.error("Error fetching clients:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
