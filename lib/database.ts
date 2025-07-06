import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

export const sql = neon(process.env.DATABASE_URL)

// Test database connection
export async function testConnection() {
  try {
    const result = await sql`SELECT 1 as test`
    console.log("Database connection successful:", result)
    return true
  } catch (error) {
    console.error("Database connection failed:", error)
    return false
  }
}

// User types
export interface User {
  id: number
  email: string
  password_hash: string
  full_name: string
  company_name?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  country: string
  is_active: boolean
  is_admin: boolean
  plan_type: string
  created_at: Date
  updated_at: Date
}

export interface Domain {
  id: number
  user_id: number
  domain_name: string
  extension: string
  registration_date: Date
  expiration_date: Date
  auto_renew: boolean
  status: string
  registrar_id?: string
  whois_privacy: boolean
  dns_management: boolean
  price: number
  created_at: Date
  updated_at: Date
}

export interface HostingAccount {
  id: number
  user_id: number
  domain_id?: number
  plan_name: string
  plan_type: string
  disk_space_gb: number
  bandwidth_gb?: number
  email_accounts: number
  databases: number
  subdomains: number
  status: string
  server_id?: string
  cpanel_username?: string
  setup_date: Date
  expiration_date: Date
  auto_renew: boolean
  price: number
  created_at: Date
  updated_at: Date
}

export interface Order {
  id: number
  user_id: number
  order_number: string
  order_type: string
  status: string
  subtotal: number
  tax_amount: number
  total_amount: number
  payment_method?: string
  payment_status: string
  payment_id?: string
  notes?: string
  created_at: Date
  updated_at: Date
}

export interface OrderItem {
  id: number
  order_id: number
  item_type: string
  item_name: string
  item_description?: string
  quantity: number
  unit_price: number
  total_price: number
  domain_id?: number
  hosting_id?: number
  created_at: Date
}

export interface SupportTicket {
  id: number
  user_id: number
  ticket_number: string
  subject: string
  priority: string
  status: string
  category?: string
  assigned_to?: number
  created_at: Date
  updated_at: Date
}

export interface Invoice {
  id: number
  user_id: number
  order_id?: number
  invoice_number: string
  status: string
  due_date: Date
  subtotal: number
  tax_amount: number
  total_amount: number
  paid_amount: number
  payment_date?: Date
  created_at: Date
  updated_at: Date
}

export interface DomainExtension {
  id: number
  extension: string
  registration_price: number
  renewal_price: number
  transfer_price: number
  is_popular: boolean
  is_active: boolean
  description?: string
  created_at: Date
}

export interface HostingPlan {
  id: number
  plan_name: string
  plan_type: string
  disk_space_gb: number
  bandwidth_gb?: number
  email_accounts: number
  databases: number
  subdomains: number
  websites: number
  cpu_cores?: number
  ram_gb?: number
  price: number
  setup_fee: number
  is_popular: boolean
  is_active: boolean
  features: string[]
  created_at: Date
}
