import { type NextRequest, NextResponse } from "next/server"
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

    const invoices = await getInvoicesByUserId(decoded.userId)

    return NextResponse.json({ invoices })
  } catch (error) {
    console.error("Invoice list fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
