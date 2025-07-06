import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import jwt from "jsonwebtoken"
import { getUserById, getDomainsByUserId, getHostingAccountsByUserId } from "@/lib/db-queries"

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

    if (isNaN(clientId)) {
      return NextResponse.json({ error: "Invalid client ID" }, { status: 400 })
    }

    // Get client details
    const [user, domains, hosting] = await Promise.all([
      getUserById(clientId),
      getDomainsByUserId(clientId),
      getHostingAccountsByUserId(clientId),
    ])

    if (!user) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

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

    return NextResponse.json({
      user,
      domains,
      hosting,
      invoices: invoices.map((i) => ({
        id: i.id,
        amount: Number.parseFloat(i.amount),
        status: i.status,
        createdAt: i.created_at,
        dueDate: i.due_date,
        description: i.description,
      })),
    })
  } catch (error) {
    console.error("Error fetching client details:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
