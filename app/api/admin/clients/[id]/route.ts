import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import jwt from "jsonwebtoken"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

    const clientId = Number.parseInt(params.id)

    // Fetch client details
    const [client] = await sql`
      SELECT 
        id,
        email,
        first_name,
        last_name,
        phone,
        status,
        created_at,
        last_login
      FROM users 
      WHERE id = ${clientId} AND role = 'user'
    `

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    // Fetch client's domains
    const domains = await sql`
      SELECT 
        id,
        domain_name as name,
        status,
        registered_at,
        expires_at,
        auto_renew
      FROM domains 
      WHERE user_id = ${clientId}
      ORDER BY registered_at DESC
    `

    // Fetch client's hosting accounts
    const hostingAccounts = await sql`
      SELECT 
        h.id,
        hp.name as plan_name,
        h.domain,
        h.status,
        h.created_at,
        h.disk_usage,
        hp.disk_space as disk_limit,
        h.bandwidth_usage,
        hp.bandwidth as bandwidth_limit
      FROM hosting_accounts h
      JOIN hosting_plans hp ON h.plan_id = hp.id
      WHERE h.user_id = ${clientId}
      ORDER BY h.created_at DESC
    `

    // Fetch client's invoices
    const invoices = await sql`
      SELECT 
        id,
        amount,
        status,
        created_at,
        due_date,
        description
      FROM invoices 
      WHERE user_id = ${clientId}
      ORDER BY created_at DESC
    `

    // Calculate totals
    const orders = await sql`
      SELECT COUNT(*) as count, COALESCE(SUM(total_amount), 0) as total
      FROM orders 
      WHERE user_id = ${clientId}
    `

    const clientDetails = {
      id: client.id,
      email: client.email,
      firstName: client.first_name,
      lastName: client.last_name,
      phone: client.phone,
      status: client.status,
      createdAt: client.created_at,
      lastLogin: client.last_login,
      totalOrders: Number.parseInt(orders[0].count),
      totalSpent: Number.parseFloat(orders[0].total),
      domains: domains.map((d) => ({
        id: d.id,
        name: d.name,
        status: d.status,
        registeredAt: d.registered_at,
        expiresAt: d.expires_at,
        autoRenew: d.auto_renew,
      })),
      hostingAccounts: hostingAccounts.map((h) => ({
        id: h.id,
        planName: h.plan_name,
        domain: h.domain,
        status: h.status,
        createdAt: h.created_at,
        diskUsage: h.disk_usage || 0,
        diskLimit: h.disk_limit || 1000,
        bandwidthUsage: h.bandwidth_usage || 0,
        bandwidthLimit: h.bandwidth_limit || 10,
      })),
      invoices: invoices.map((i) => ({
        id: i.id,
        amount: Number.parseFloat(i.amount),
        status: i.status,
        createdAt: i.created_at,
        dueDate: i.due_date,
        description: i.description,
      })),
    }

    return NextResponse.json({ client: clientDetails })
  } catch (error) {
    console.error("Error fetching client details:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
