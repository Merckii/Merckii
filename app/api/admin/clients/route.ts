import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any

    if (!decoded.isAdmin && decoded.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    // Get clients with search functionality
    let clients
    if (search) {
      clients = await sql`
        SELECT 
          u.id,
          u.name,
          u.email,
          u.company,
          u.status,
          u.created_at,
          COUNT(DISTINCT d.id) as domain_count,
          COUNT(DISTINCT h.id) as hosting_count,
          COUNT(DISTINCT o.id) as order_count,
          COALESCE(SUM(o.amount), 0) as total_spent
        FROM users u
        LEFT JOIN domains d ON u.id = d.user_id
        LEFT JOIN hosting_accounts h ON u.id = h.user_id
        LEFT JOIN orders o ON u.id = o.user_id AND o.status = 'completed'
        WHERE u.is_admin = false 
        AND (u.name ILIKE ${`%${search}%`} OR u.email ILIKE ${`%${search}%`} OR u.company ILIKE ${`%${search}%`})
        GROUP BY u.id, u.name, u.email, u.company, u.status, u.created_at
        ORDER BY u.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    } else {
      clients = await sql`
        SELECT 
          u.id,
          u.name,
          u.email,
          u.company,
          u.status,
          u.created_at,
          COUNT(DISTINCT d.id) as domain_count,
          COUNT(DISTINCT h.id) as hosting_count,
          COUNT(DISTINCT o.id) as order_count,
          COALESCE(SUM(o.amount), 0) as total_spent
        FROM users u
        LEFT JOIN domains d ON u.id = d.user_id
        LEFT JOIN hosting_accounts h ON u.id = h.user_id
        LEFT JOIN orders o ON u.id = o.user_id AND o.status = 'completed'
        WHERE u.is_admin = false
        GROUP BY u.id, u.name, u.email, u.company, u.status, u.created_at
        ORDER BY u.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    }

    // Get total count for pagination
    const totalResult = await sql`
      SELECT COUNT(*) as total 
      FROM users 
      WHERE is_admin = false
      ${search ? sql`AND (name ILIKE ${`%${search}%`} OR email ILIKE ${`%${search}%`} OR company ILIKE ${`%${search}%`})` : sql``}
    `

    const total = Number.parseInt(totalResult[0].total)

    return NextResponse.json({
      clients,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Admin clients error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
