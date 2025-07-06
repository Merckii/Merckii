import { sql } from "./database"

export interface BillingCycle {
  id: number
  user_id: number
  service_type: string
  service_id: number
  billing_frequency: string
  amount: number
  next_billing_date: Date
  is_active: boolean
}

export interface PaymentRecord {
  id: number
  user_id: number
  order_id?: number
  invoice_id?: number
  amount: number
  payment_method: string
  payment_status: string
  transaction_id?: string
  notes?: string
  created_at: Date
}

export async function createBillingCycle(cycleData: {
  user_id: number
  service_type: string
  service_id: number
  billing_frequency: string
  amount: number
  next_billing_date: Date
}) {
  const result = await sql`
    INSERT INTO billing_cycles (
      user_id, service_type, service_id, billing_frequency, 
      amount, next_billing_date, is_active
    )
    VALUES (
      ${cycleData.user_id}, ${cycleData.service_type}, ${cycleData.service_id},
      ${cycleData.billing_frequency}, ${cycleData.amount}, ${cycleData.next_billing_date}, true
    )
    RETURNING *
  `
  return result[0]
}

export async function getBillingCyclesByUserId(userId: number) {
  const result = await sql`
    SELECT * FROM billing_cycles 
    WHERE user_id = ${userId} AND is_active = true
    ORDER BY next_billing_date ASC
  `
  return result
}

export async function createPaymentRecord(paymentData: {
  user_id: number
  order_id?: number
  invoice_id?: number
  amount: number
  payment_method: string
  payment_status: string
  transaction_id?: string
  notes?: string
}) {
  const result = await sql`
    INSERT INTO payment_records (
      user_id, order_id, invoice_id, amount, payment_method,
      payment_status, transaction_id, notes
    )
    VALUES (
      ${paymentData.user_id}, ${paymentData.order_id || null}, ${paymentData.invoice_id || null},
      ${paymentData.amount}, ${paymentData.payment_method}, ${paymentData.payment_status},
      ${paymentData.transaction_id || null}, ${paymentData.notes || null}
    )
    RETURNING *
  `
  return result[0]
}

export async function getPaymentRecordsByUserId(userId: number) {
  const result = await sql`
    SELECT pr.*, o.order_number, i.invoice_number
    FROM payment_records pr
    LEFT JOIN orders o ON pr.order_id = o.id
    LEFT JOIN invoices i ON pr.invoice_id = i.id
    WHERE pr.user_id = ${userId}
    ORDER BY pr.created_at DESC
  `
  return result
}

export async function getBillingSummary(userId: number) {
  const [unpaidInvoices, totalPaid, recurringAmount, creditBalance] = await Promise.all([
    sql`
      SELECT COUNT(*) as count, COALESCE(SUM(total_amount), 0) as amount
      FROM invoices 
      WHERE user_id = ${userId} AND payment_status = 'unpaid'
    `,
    sql`
      SELECT COALESCE(SUM(amount), 0) as amount
      FROM payment_records 
      WHERE user_id = ${userId} AND payment_status = 'completed'
    `,
    sql`
      SELECT COALESCE(SUM(amount), 0) as amount
      FROM billing_cycles 
      WHERE user_id = ${userId} AND is_active = true
    `,
    sql`
      SELECT COALESCE(credit_balance, 0) as balance
      FROM users 
      WHERE id = ${userId}
    `,
  ])

  return {
    unpaidInvoices: {
      count: Number.parseInt(unpaidInvoices[0].count),
      amount: Number.parseFloat(unpaidInvoices[0].amount),
    },
    totalPaid: Number.parseFloat(totalPaid[0].amount),
    monthlyRecurring: Number.parseFloat(recurringAmount[0].amount),
    creditBalance: Number.parseFloat(creditBalance[0].balance || 0),
  }
}

export async function updatePaymentStatus(paymentId: number, status: string) {
  const result = await sql`
    UPDATE payment_records 
    SET payment_status = ${status}, updated_at = NOW()
    WHERE id = ${paymentId}
    RETURNING *
  `
  return result[0] || null
}
