import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"
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

    const paymentMethods = await sql`
      SELECT * FROM user_payment_methods 
      WHERE user_id = ${decoded.userId} AND is_active = true
      ORDER BY is_default DESC, created_at DESC
    `

    return NextResponse.json({ paymentMethods })
  } catch (error) {
    console.error("Payment methods fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any

    const { paymentType, providerCustomerId, providerPaymentMethodId, lastFour, brand, expMonth, expYear, isDefault } =
      await request.json()

    if (!paymentType) {
      return NextResponse.json({ error: "Payment type is required" }, { status: 400 })
    }

    // If setting as default, unset other default methods
    if (isDefault) {
      await sql`
        UPDATE user_payment_methods 
        SET is_default = false 
        WHERE user_id = ${decoded.userId}
      `
    }

    const result = await sql`
      INSERT INTO user_payment_methods (
        user_id, payment_type, provider_customer_id, provider_payment_method_id,
        last_four, brand, exp_month, exp_year, is_default
      ) VALUES (
        ${decoded.userId}, ${paymentType}, ${providerCustomerId || null}, ${providerPaymentMethodId || null},
        ${lastFour || null}, ${brand || null}, ${expMonth || null}, ${expYear || null}, ${isDefault || false}
      ) RETURNING *
    `

    return NextResponse.json({
      message: "Payment method added successfully",
      paymentMethod: result[0],
    })
  } catch (error) {
    console.error("Payment method creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any

    const { searchParams } = new URL(request.url)
    const methodId = searchParams.get("id")

    if (!methodId) {
      return NextResponse.json({ error: "Payment method ID is required" }, { status: 400 })
    }

    await sql`
      UPDATE user_payment_methods 
      SET is_active = false 
      WHERE id = ${methodId} AND user_id = ${decoded.userId}
    `

    return NextResponse.json({ message: "Payment method removed successfully" })
  } catch (error) {
    console.error("Payment method deletion error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
