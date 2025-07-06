import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any

    if (!decoded.isAdmin && decoded.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const clientId = params.id

    // Get client details
    const clients = await sql`
      SELECT id, name, email, company, status, created_at
      FROM users 
      WHERE id = ${clientId} AND is_admin = false
    `

    if (clients.length === 0) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    const client = clients[0]

    // Get client domains
    const domains = await sql`
      SELECT id, domain_name, extension, status, registration_date, expiration_date, auto_renew
      FROM domains 
      WHERE user_id = ${clientId}
      ORDER BY created_at DESC
    `

    // Get client hosting accounts
    const hosting = await sql`
      SELECT id, plan_name, status, disk_usage, bandwidth_usage, email_accounts, created_at
      FROM hosting_accounts 
      WHERE user_id = ${clientId}
      ORDER BY created_at DESC
    `

    // Get client invoices
    const invoices = await sql`
      SELECT id, invoice_number, total_amount, status, due_date, created_at
      FROM invoices 
      WHERE user_id = ${clientId}
      ORDER BY created_at DESC
      LIMIT 10
    `

    // Get client orders
    const orders = await sql`
      SELECT id, order_type, item_name, amount, status, created_at
      FROM orders 
      WHERE user_id = ${clientId}
      ORDER BY created_at DESC
      LIMIT 10
    `

    // Get client payment records
    const payments = await sql`
      SELECT id, amount, payment_method, payment_status, transaction_id, created_at
      FROM payment_records 
      WHERE user_id = ${clientId}
      ORDER BY created_at DESC
      LIMIT 10
    `

    return NextResponse.json({
      client,
      domains,
      hosting,
      invoices,
      orders,
      payments,
    })
  } catch (error) {
    console.error("Admin client details error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
