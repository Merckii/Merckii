import { sql } from "./database"

// User Management
export async function createUser(userData: {
  email: string
  password_hash: string
  full_name: string
  company_name?: string
  plan_type?: string
}) {
  const result = await sql`
    INSERT INTO users (email, password_hash, full_name, company_name, plan_type)
    VALUES (${userData.email}, ${userData.password_hash}, ${userData.full_name}, 
            ${userData.company_name || null}, ${userData.plan_type || "starter"})
    RETURNING *
  `
  return result[0]
}

export async function getUserByEmail(email: string) {
  const result = await sql`
    SELECT * FROM users WHERE email = ${email} LIMIT 1
  `
  return result[0] || null
}

export async function getUserById(id: number) {
  const result = await sql`
    SELECT * FROM users WHERE id = ${id} LIMIT 1
  `
  return result[0] || null
}

export async function updateUser(id: number, updates: any) {
  const fields = Object.keys(updates)
  const values = Object.values(updates)

  if (fields.length === 0) return null

  const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(", ")

  const result = await sql`
    UPDATE users 
    SET ${sql.unsafe(setClause)}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `
  return result[0] || null
}

// Domain Management
export async function getDomainExtensions() {
  const result = await sql`
    SELECT * FROM domain_extensions 
    WHERE is_active = true 
    ORDER BY is_popular DESC, registration_price ASC
  `
  return result
}

export async function getDomainExtensionByName(extension: string) {
  const result = await sql`
    SELECT * FROM domain_extensions 
    WHERE extension = ${extension} AND is_active = true
    LIMIT 1
  `
  return result[0] || null
}

export async function checkDomainAvailability(domainName: string, extension: string) {
  // Check if domain already exists in our database
  const existing = await sql`
    SELECT id FROM domains 
    WHERE domain_name = ${domainName} AND extension = ${extension}
    LIMIT 1
  `

  // If exists in our DB, it's not available
  if (existing.length > 0) return false

  // For demo purposes, randomly determine availability
  // In production, you'd check with domain registrar APIs
  const hash = domainName.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0)
    return a & a
  }, 0)

  return Math.abs(hash) % 3 !== 0 // ~66% availability rate
}

export async function createDomain(domainData: {
  user_id: number
  domain_name: string
  extension: string
  registration_date: Date
  expiration_date: Date
  price: number
}) {
  const result = await sql`
    INSERT INTO domains (user_id, domain_name, extension, registration_date, expiration_date, price)
    VALUES (${domainData.user_id}, ${domainData.domain_name}, ${domainData.extension},
            ${domainData.registration_date}, ${domainData.expiration_date}, ${domainData.price})
    RETURNING *
  `
  return result[0]
}

export async function getDomainsByUserId(userId: number) {
  const result = await sql`
    SELECT d.*, de.registration_price, de.renewal_price
    FROM domains d
    JOIN domain_extensions de ON d.extension = de.extension
    WHERE d.user_id = ${userId}
    ORDER BY d.created_at DESC
  `
  return result
}

// Hosting Management
export async function getHostingPlans() {
  const result = await sql`
    SELECT * FROM hosting_plans 
    WHERE is_active = true 
    ORDER BY price ASC
  `
  return result
}

export async function getHostingPlanByName(planName: string) {
  const result = await sql`
    SELECT * FROM hosting_plans 
    WHERE plan_name = ${planName} AND is_active = true
    LIMIT 1
  `
  return result[0] || null
}

export async function createHostingAccount(hostingData: {
  user_id: number
  plan_name: string
  plan_type: string
  disk_space_gb: number
  email_accounts: number
  databases: number
  setup_date: Date
  expiration_date: Date
  price: number
}) {
  const result = await sql`
    INSERT INTO hosting_accounts (
      user_id, plan_name, plan_type, disk_space_gb, email_accounts, 
      databases, setup_date, expiration_date, price
    )
    VALUES (
      ${hostingData.user_id}, ${hostingData.plan_name}, ${hostingData.plan_type},
      ${hostingData.disk_space_gb}, ${hostingData.email_accounts}, ${hostingData.databases},
      ${hostingData.setup_date}, ${hostingData.expiration_date}, ${hostingData.price}
    )
    RETURNING *
  `
  return result[0]
}

export async function getHostingAccountsByUserId(userId: number) {
  const result = await sql`
    SELECT * FROM hosting_accounts 
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `
  return result
}

// Order Management
export async function createOrder(orderData: {
  user_id: number
  order_number: string
  order_type: string
  subtotal: number
  tax_amount: number
  total_amount: number
  payment_method: string
}) {
  const result = await sql`
    INSERT INTO orders (
      user_id, order_number, order_type, subtotal, tax_amount, 
      total_amount, payment_method, order_status
    )
    VALUES (
      ${orderData.user_id}, ${orderData.order_number}, ${orderData.order_type},
      ${orderData.subtotal}, ${orderData.tax_amount}, ${orderData.total_amount},
      ${orderData.payment_method}, 'pending'
    )
    RETURNING *
  `
  return result[0]
}

export async function getOrdersByUserId(userId: number) {
  const result = await sql`
    SELECT * FROM orders 
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `
  return result
}

export async function getOrderById(orderId: number) {
  const result = await sql`
    SELECT * FROM orders WHERE id = ${orderId} LIMIT 1
  `
  return result[0] || null
}

export async function updateOrderStatus(orderId: number, status: string) {
  const result = await sql`
    UPDATE orders 
    SET order_status = ${status}, updated_at = NOW()
    WHERE id = ${orderId}
    RETURNING *
  `
  return result[0] || null
}

// Admin Functions
export async function getAllUsers(limit = 50, offset = 0) {
  const result = await sql`
    SELECT id, email, full_name, company_name, plan_type, is_admin, 
           created_at, updated_at, last_login
    FROM users 
    ORDER BY created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `
  return result
}

export async function getAllOrders(limit = 50, offset = 0) {
  const result = await sql`
    SELECT o.*, u.email, u.full_name
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `
  return result
}

export async function getDashboardStats() {
  const [userStats, orderStats, domainStats, hostingStats] = await Promise.all([
    sql`SELECT COUNT(*) as total_users FROM users`,
    sql`SELECT COUNT(*) as total_orders, SUM(total_amount) as total_revenue FROM orders WHERE order_status = 'completed'`,
    sql`SELECT COUNT(*) as total_domains FROM domains`,
    sql`SELECT COUNT(*) as total_hosting FROM hosting_accounts`,
  ])

  return {
    totalUsers: Number.parseInt(userStats[0].total_users),
    totalOrders: Number.parseInt(orderStats[0].total_orders),
    totalRevenue: Number.parseFloat(orderStats[0].total_revenue || 0),
    totalDomains: Number.parseInt(domainStats[0].total_domains),
    totalHosting: Number.parseInt(hostingStats[0].total_hosting),
  }
}
