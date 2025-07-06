import { type NextRequest, NextResponse } from "next/server"
import { createPaymentRecord, updatePaymentStatus } from "@/lib/billing"
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

    const paymentData = await request.json()

    if (!paymentData.amount || !paymentData.payment_method) {
      return NextResponse.json({ error: "Amount and payment method are required" }, { status: 400 })
    }

    const paymentRecord = await createPaymentRecord({
      user_id: decoded.userId,
      ...paymentData,
    })

    return NextResponse.json({
      message: "Payment recorded successfully",
      paymentRecord,
    })
  } catch (error) {
    console.error("Payment record error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any

    const { paymentId, status } = await request.json()

    if (!paymentId || !status) {
      return NextResponse.json({ error: "Payment ID and status are required" }, { status: 400 })
    }

    const updatedPayment = await updatePaymentStatus(paymentId, status)

    return NextResponse.json({
      message: "Payment status updated successfully",
      payment: updatedPayment,
    })
  } catch (error) {
    console.error("Payment status update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
