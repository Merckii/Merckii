import { type NextRequest, NextResponse } from "next/server"
import { capturePayPalPayment, verifyBinancePayment } from "@/lib/payment-providers"
import { createPaymentRecord } from "@/lib/billing"
import { markInvoiceAsPaid } from "@/lib/invoice-generator"
import { updateOrderStatus } from "@/lib/db-queries"
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

    const { paymentMethod, paymentId, invoiceId, orderId, amount } = await request.json()

    if (!paymentMethod || !paymentId || !amount) {
      return NextResponse.json({ error: "Payment method, payment ID, and amount are required" }, { status: 400 })
    }

    let captureResult
    let transactionId

    switch (paymentMethod) {
      case "paypal":
        captureResult = await capturePayPalPayment(paymentId)
        transactionId = captureResult.id
        break

      case "binance":
        captureResult = await verifyBinancePayment(paymentId)
        transactionId = captureResult.data?.transactionId
        break

      case "stripe":
        // Stripe payments are automatically captured
        transactionId = paymentId
        captureResult = { status: "COMPLETED" }
        break

      default:
        return NextResponse.json({ error: "Unsupported payment method" }, { status: 400 })
    }

    // Record the payment
    const paymentRecord = await createPaymentRecord({
      user_id: decoded.userId,
      invoice_id: invoiceId || null,
      order_id: orderId || null,
      amount: amount,
      payment_method: paymentMethod,
      payment_status: "completed",
      transaction_id: transactionId,
    })

    // Mark invoice as paid if provided
    if (invoiceId) {
      await markInvoiceAsPaid(invoiceId, amount, paymentMethod)
    }

    // Update order status if provided
    if (orderId) {
      await updateOrderStatus(orderId, "completed")
    }

    return NextResponse.json({
      message: "Payment captured successfully",
      paymentRecord,
      transactionId,
    })
  } catch (error) {
    console.error("Payment capture error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
