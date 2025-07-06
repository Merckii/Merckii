import { type NextRequest, NextResponse } from "next/server"
import { createInvoiceFromOrder, getInvoiceData, generateInvoiceHTML } from "@/lib/invoice-generator"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any

    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    // Create invoice from order
    const invoice = await createInvoiceFromOrder(orderId)

    return NextResponse.json(
      {
        message: "Invoice generated successfully",
        invoice,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Invoice generation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any

    const url = new URL(request.url)
    const invoiceId = url.searchParams.get("id")
    const format = url.searchParams.get("format") || "json"

    if (!invoiceId) {
      return NextResponse.json({ error: "Invoice ID is required" }, { status: 400 })
    }

    const invoiceData = await getInvoiceData(Number.parseInt(invoiceId))
    if (!invoiceData) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    // Check if user owns this invoice
    if (invoiceData.invoice.user_id !== decoded.userId && !decoded.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    if (format === "html") {
      const html = generateInvoiceHTML(invoiceData)
      return new NextResponse(html, {
        headers: {
          "Content-Type": "text/html",
        },
      })
    }

    return NextResponse.json({ invoiceData }, { status: 200 })
  } catch (error) {
    console.error("Invoice retrieval error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
