import { sql } from "./database"
import { getOrderById, getUserById } from "./db-queries"

export interface Invoice {
  id: number
  user_id: number
  order_id?: number
  invoice_number: string
  total_amount: number
  payment_status: string
  due_date: Date
  created_at: Date
}

export async function createInvoiceFromOrder(orderId: number) {
  const order = await getOrderById(orderId)
  if (!order) throw new Error("Order not found")

  const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + 30) // 30 days from now

  const result = await sql`
    INSERT INTO invoices (
      user_id, order_id, invoice_number, total_amount, 
      payment_status, due_date
    )
    VALUES (
      ${order.user_id}, ${orderId}, ${invoiceNumber}, ${order.total_amount},
      'unpaid', ${dueDate}
    )
    RETURNING *
  `
  return result[0]
}

export async function getInvoicesByUserId(userId: number) {
  const result = await sql`
    SELECT * FROM invoices 
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `
  return result
}

export async function getInvoiceData(invoiceId: number) {
  const invoice = await sql`
    SELECT * FROM invoices WHERE id = ${invoiceId} LIMIT 1
  `

  if (!invoice[0]) return null

  const user = await getUserById(invoice[0].user_id)
  const order = invoice[0].order_id ? await getOrderById(invoice[0].order_id) : null

  return {
    invoice: invoice[0],
    user,
    order,
  }
}

export async function markInvoiceAsPaid(invoiceId: number, amount: number, paymentMethod: string) {
  const result = await sql`
    UPDATE invoices 
    SET payment_status = 'paid', paid_amount = ${amount}, 
        payment_method = ${paymentMethod}, paid_at = NOW()
    WHERE id = ${invoiceId}
    RETURNING *
  `
  return result[0] || null
}

export function generateInvoiceHTML(invoiceData: any) {
  const { invoice, user, order } = invoiceData

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice ${invoice.invoice_number}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .header { border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
        .company-name { font-size: 24px; font-weight: bold; color: #2563eb; }
        .invoice-title { font-size: 28px; font-weight: bold; margin: 20px 0; }
        .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .bill-to { margin-bottom: 30px; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .items-table th, .items-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        .items-table th { background-color: #f8f9fa; }
        .total-section { text-align: right; }
        .total-row { margin: 5px 0; }
        .grand-total { font-size: 18px; font-weight: bold; }
        .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-name">Host Domain Reseller</div>
        <div>Professional Domain & Hosting Services</div>
      </div>

      <div class="invoice-title">INVOICE</div>

      <div class="invoice-details">
        <div>
          <strong>Invoice Number:</strong> ${invoice.invoice_number}<br>
          <strong>Invoice Date:</strong> ${new Date(invoice.created_at).toLocaleDateString()}<br>
          <strong>Due Date:</strong> ${new Date(invoice.due_date).toLocaleDateString()}
        </div>
        <div>
          <strong>Status:</strong> ${invoice.payment_status.toUpperCase()}<br>
          <strong>Amount:</strong> $${invoice.total_amount.toFixed(2)}
        </div>
      </div>

      <div class="bill-to">
        <strong>Bill To:</strong><br>
        ${user.full_name}<br>
        ${user.company_name ? user.company_name + "<br>" : ""}
        ${user.email}
      </div>

      <table class="items-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${order ? `${order.order_type} Services` : "Services"}</td>
            <td>1</td>
            <td>$${order ? order.subtotal.toFixed(2) : invoice.total_amount.toFixed(2)}</td>
            <td>$${order ? order.subtotal.toFixed(2) : invoice.total_amount.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <div class="total-section">
        <div class="total-row">Subtotal: $${order ? order.subtotal.toFixed(2) : invoice.total_amount.toFixed(2)}</div>
        ${order ? `<div class="total-row">Tax: $${order.tax_amount.toFixed(2)}</div>` : ""}
        <div class="total-row grand-total">Total: $${invoice.total_amount.toFixed(2)}</div>
      </div>

      <div class="footer">
        <p><strong>Payment Terms:</strong> Payment is due within 30 days of invoice date.</p>
        <p><strong>Thank you for your business!</strong></p>
      </div>
    </body>
    </html>
  `
}
