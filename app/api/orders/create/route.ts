import { type NextRequest, NextResponse } from "next/server"
import {
  createOrder,
  createDomain,
  createHostingAccount,
  getDomainExtensionByName,
  getHostingPlanByName,
} from "@/lib/db-queries"
import { createInvoiceFromOrder } from "@/lib/invoice-generator"
import { createBillingCycle } from "@/lib/billing"
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

    const { orderType, items, billingFrequency = "yearly" } = await request.json()

    if (!orderType || !items || !Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid order data" }, { status: 400 })
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Calculate totals
    let subtotal = 0
    const processedItems = []

    for (const item of items) {
      if (item.type === "domain") {
        const extension = await getDomainExtensionByName(item.extension)
        if (extension) {
          subtotal += extension.registration_price
          processedItems.push({ ...item, price: extension.registration_price })
        }
      } else if (item.type === "hosting") {
        const plan = await getHostingPlanByName(item.planName)
        if (plan) {
          subtotal += plan.price
          processedItems.push({ ...item, price: plan.price })
        }
      }
    }

    const taxAmount = subtotal * 0.08 // 8% tax
    const totalAmount = subtotal + taxAmount

    // Create order
    const order = await createOrder({
      user_id: decoded.userId,
      order_number: orderNumber,
      order_type: orderType,
      subtotal,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      payment_method: "pending",
    })

    // Process order items and create services
    const createdServices = []

    for (const item of processedItems) {
      if (item.type === "domain") {
        const extension = await getDomainExtensionByName(item.extension)
        if (extension) {
          const registrationDate = new Date()
          const expirationDate = new Date()
          expirationDate.setFullYear(expirationDate.getFullYear() + 1)

          const domain = await createDomain({
            user_id: decoded.userId,
            domain_name: item.domainName,
            extension: item.extension,
            registration_date: registrationDate,
            expiration_date: expirationDate,
            price: extension.registration_price,
          })

          // Create billing cycle for domain renewal
          const nextBillingDate = new Date(expirationDate)
          await createBillingCycle({
            user_id: decoded.userId,
            service_type: "domain",
            service_id: domain.id,
            billing_frequency: "yearly",
            amount: extension.renewal_price,
            next_billing_date: nextBillingDate,
          })

          createdServices.push({ type: "domain", data: domain })
        }
      } else if (item.type === "hosting") {
        const plan = await getHostingPlanByName(item.planName)
        if (plan) {
          const setupDate = new Date()
          const expirationDate = new Date()

          // Set expiration based on billing frequency
          if (billingFrequency === "monthly") {
            expirationDate.setMonth(expirationDate.getMonth() + 1)
          } else if (billingFrequency === "quarterly") {
            expirationDate.setMonth(expirationDate.getMonth() + 3)
          } else {
            expirationDate.setFullYear(expirationDate.getFullYear() + 1)
          }

          const hosting = await createHostingAccount({
            user_id: decoded.userId,
            plan_name: plan.plan_name,
            plan_type: plan.plan_type,
            disk_space_gb: plan.disk_space_gb,
            email_accounts: plan.email_accounts,
            databases: plan.databases,
            setup_date: setupDate,
            expiration_date: expirationDate,
            price: plan.price,
          })

          // Create billing cycle for hosting renewal
          await createBillingCycle({
            user_id: decoded.userId,
            service_type: "hosting",
            service_id: hosting.id,
            billing_frequency: billingFrequency,
            amount: plan.price,
            next_billing_date: expirationDate,
          })

          createdServices.push({ type: "hosting", data: hosting })
        }
      }
    }

    // Generate invoice
    const invoice = await createInvoiceFromOrder(order.id)

    return NextResponse.json(
      {
        message: "Order created successfully",
        order,
        invoice,
        services: createdServices,
        orderNumber,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
