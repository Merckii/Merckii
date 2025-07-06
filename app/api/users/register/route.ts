import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, company, planType } = await request.json()

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Check if user already exists
    const existingUsers = await sql`
      SELECT id FROM users WHERE email = ${email.toLowerCase()}
    `

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })
    }

    // Hash password with bcrypt
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create new user
    const newUsers = await sql`
      INSERT INTO users (
        name, 
        email, 
        password, 
        company, 
        is_admin, 
        role, 
        status, 
        plan_type, 
        created_at,
        updated_at
      )
      VALUES (
        ${name.trim()}, 
        ${email.toLowerCase().trim()}, 
        ${hashedPassword}, 
        ${company ? company.trim() : null}, 
        false, 
        'customer', 
        'active', 
        ${planType || "starter"}, 
        NOW(),
        NOW()
      )
      RETURNING id, name, email, company, is_admin, role, status, plan_type, created_at
    `

    const user = newUsers[0]

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        isAdmin: user.is_admin,
        role: user.role,
        name: user.name,
      },
      process.env.JWT_SECRET || "your-secret-key-change-in-production",
      { expiresIn: "7d" },
    )

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          company: user.company,
          is_admin: user.is_admin,
          role: user.role,
          status: user.status,
          plan_type: user.plan_type,
          created_at: user.created_at,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)

    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes("duplicate key")) {
        return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })
      }
      if (error.message.includes("invalid input")) {
        return NextResponse.json({ error: "Invalid input data" }, { status: 400 })
      }
    }

    return NextResponse.json(
      {
        error: "Internal server error. Please try again later.",
      },
      { status: 500 },
    )
  }
}
