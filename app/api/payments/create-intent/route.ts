import { type NextRequest, NextResponse } from "next/server"
import { createStripePaymentIntent, createPayPalPayment, createBinancePayment } from "@/lib/payment-providers"
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

    const { amount, currency, paymentMethod } = await request.json()

    if (!amount || !paymentMethod) {
      return NextResponse.json({ error: "Amount and payment method are required" }, { status: 400 })
    }

    if (amount <= 0) {
      return NextResponse.json({ error: "Amount must be greater than 0" }, { status: 400 })
    }

    let paymentData

    switch (paymentMethod) {
      case "stripe":
        paymentData = await createStripePaymentIntent(amount, currency || "usd")
        return NextResponse.json({
          clientSecret: paymentData.client_secret,
          paymentIntentId: paymentData.id,
        })

      case "paypal":
        paymentData = await createPayPalPayment(amount, currency || "USD")
        return NextResponse.json({
          orderId: paymentData.id,
          approvalUrl: paymentData.links?.find((link: any) => link.rel === "approve")?.href,
        })

      case "binance":
        paymentData = await createBinancePayment(amount, currency || "USDT")
        return NextResponse.json({
          prepayId: paymentData.data?.prepayId,
          checkoutUrl: paymentData.data?.checkoutUrl,
        })

      default:
        return NextResponse.json({ error: "Unsupported payment method" }, { status: 400 })
    }
  } catch (error) {
    console.error("Payment intent creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
