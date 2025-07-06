import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any
    const userId = decoded.userId

    const { type, plan, name, price, domain } = await request.json()

    if (!type || !name || !price) {
      return NextResponse.json({ error: "Order type, name, and price are required" }, { status: 400 })
    }

    // Create order
    const orders = await sql`
      INSERT INTO orders (user_id, order_type, item_name, amount, status, created_at)
      VALUES (${userId}, ${type}, ${name}, ${price}, 'pending', NOW())
      RETURNING *
    `

    const order = orders[0]

    // If it's a hosting order, create hosting account
    if (type === "hosting") {
      await sql`
        INSERT INTO hosting_accounts (user_id, plan_name, status, disk_usage, bandwidth_usage, email_accounts, created_at)
        VALUES (${userId}, ${name}, 'active', 0, 0, 0, NOW())
      `
    }

    // If it's a domain order, create domain record
    if (type === "domain" && domain) {
      const extension = domain.startsWith(".") ? domain : ".com"
      const domainName = domain.replace(extension, "")

      await sql`
        INSERT INTO domains (user_id, domain_name, extension, status, registration_date, expiration_date, auto_renew, created_at)
        VALUES (${userId}, ${domainName}, ${extension}, 'pending', NOW(), NOW() + INTERVAL '1 year', true, NOW())
      `
    }

    // Create invoice
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
    await sql`
      INSERT INTO invoices (user_id, invoice_number, total_amount, status, due_date, created_at)
      VALUES (${userId}, ${invoiceNumber}, ${price}, 'unpaid', NOW() + INTERVAL '30 days', NOW())
    `

    return NextResponse.json({
      order,
      message: "Order created successfully",
    })
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
