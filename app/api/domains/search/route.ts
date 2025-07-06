import { type NextRequest, NextResponse } from "next/server"
import { getDomainExtensions, checkDomainAvailability } from "@/lib/db-queries"

export async function POST(request: NextRequest) {
  try {
    const { domain } = await request.json()

    if (!domain || typeof domain !== "string") {
      return NextResponse.json({ error: "Domain name is required" }, { status: 400 })
    }

    // Clean the domain name
    const cleanDomain = domain.toLowerCase().replace(/[^a-z0-9-]/g, "")

    if (cleanDomain.length < 2) {
      return NextResponse.json({ error: "Domain name too short" }, { status: 400 })
    }

    // Get all available extensions
    const extensions = await getDomainExtensions()

    // Check availability for each extension
    const results = await Promise.all(
      extensions.map(async (ext) => {
        const available = await checkDomainAvailability(cleanDomain, ext.extension)
        return {
          domain: ext.extension,
          price: `$${ext.registration_price}`,
          available,
          popular: ext.is_popular,
          fullDomain: `${cleanDomain}${ext.extension}`,
        }
      }),
    )

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Domain search error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
