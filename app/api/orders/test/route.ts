import { type NextRequest, NextResponse } from "next/server"
import {
  createOrder,
  createDomain,
  createHostingAccount,
  getDomainExtensionByName,
  getHostingPlanByName,
} from "@/lib/db-queries"
import { createInvoiceFromOrder } from "@/lib/invoice-generator"
import { createPaymentRecord } from "@/lib/billing"
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

    // Create test order
    const orderNumber = `TEST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const testDomainName = `test-${Date.now()}`

    // Get domain extension and hosting plan
    const domainExtension = await getDomainExtensionByName(".com")
    const hostingPlan = await getHostingPlanByName("Business Plan")

    if (!domainExtension || !hostingPlan) {
      return NextResponse.json({ error: "Required plans not found" }, { status: 400 })
    }

    const subtotal = domainExtension.registration_price + hostingPlan.price
    const taxAmount = subtotal * 0.08
    const totalAmount = subtotal + taxAmount

    const testOrder = {
      user_id: decoded.userId,
      order_number: orderNumber,
      order_type: "test",
      subtotal,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      payment_method: "test",
    }

    const order = await createOrder(testOrder)

    // Create test domain
    const testDomain = {
      user_id: decoded.userId,
      domain_name: testDomainName,
      extension: ".com",
      registration_date: new Date(),
      expiration_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      price: domainExtension.registration_price,
    }

    const domain = await createDomain(testDomain)

    // Create test hosting account
    const testHosting = {
      user_id: decoded.userId,
      plan_name: hostingPlan.plan_name,
      plan_type: hostingPlan.plan_type,
      disk_space_gb: hostingPlan.disk_space_gb,
      email_accounts: hostingPlan.email_accounts,
      databases: hostingPlan.databases,
      setup_date: new Date(),
      expiration_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      price: hostingPlan.price,
    }

    const hosting = await createHostingAccount(testHosting)

    // Generate invoice
    const invoice = await createInvoiceFromOrder(order.id)

    // Create test payment record
    const paymentRecord = await createPaymentRecord({
      user_id: decoded.userId,
      invoice_id: invoice.id,
      order_id: order.id,
      amount: order.total_amount,
      payment_method: "test_payment",
      payment_status: "completed",
      transaction_id: `test_tx_${Date.now()}`,
      notes: "Test payment for system verification",
    })

    return NextResponse.json({
      message: "Test order created successfully",
      order,
      domain,
      hosting,
      invoice,
      paymentRecord,
      testData: {
        domainName: `${testDomainName}.com`,
        hostingPlan: hostingPlan.plan_name,
        totalAmount: totalAmount.toFixed(2),
      },
    })
  } catch (error) {
    console.error("Test order creation error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
