import { type NextRequest, NextResponse } from "next/server"

const domainExtensions = [
  { extension: ".com", price: "$12.99", available: true, popular: true },
  { extension: ".net", price: "$14.99", available: true, popular: false },
  { extension: ".org", price: "$13.99", available: Math.random() > 0.3, popular: false },
  { extension: ".io", price: "$49.99", available: Math.random() > 0.4, popular: true },
  { extension: ".co", price: "$29.99", available: Math.random() > 0.5, popular: false },
  { extension: ".app", price: "$19.99", available: Math.random() > 0.3, popular: true },
  { extension: ".dev", price: "$24.99", available: Math.random() > 0.4, popular: false },
  { extension: ".tech", price: "$34.99", available: Math.random() > 0.6, popular: false },
]

export async function POST(request: NextRequest) {
  try {
    const { domain } = await request.json()

    if (!domain) {
      return NextResponse.json({ error: "Domain name is required" }, { status: 400 })
    }

    // Clean the domain name
    const cleanDomain = domain.toLowerCase().replace(/[^a-z0-9-]/g, "")

    if (cleanDomain.length < 2) {
      return NextResponse.json({ error: "Domain name too short" }, { status: 400 })
    }

    // Simulate domain search with random availability
    const results = domainExtensions.map((ext) => ({
      domain: ext.extension,
      price: ext.price,
      available: ext.available,
      popular: ext.popular,
      fullDomain: `${cleanDomain}${ext.extension}`,
    }))

    // Add some delay to simulate real API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      domain: cleanDomain,
      results,
      message: "Domain search completed",
    })
  } catch (error) {
    console.error("Domain search error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
