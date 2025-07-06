"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Check, X } from "lucide-react"

export function DomainSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [mockDomainResults, setMockDomainResults] = useState([
    { domain: ".com", price: "$12.99", available: true, popular: true },
    { domain: ".net", price: "$14.99", available: true, popular: false },
    { domain: ".org", price: "$13.99", available: false, popular: false },
    { domain: ".io", price: "$49.99", available: true, popular: true },
    { domain: ".co", price: "$29.99", available: true, popular: false },
    { domain: ".app", price: "$19.99", available: true, popular: true },
  ])

  const handleSearch = async () => {
    if (!searchTerm.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch("/api/domains/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domain: searchTerm }),
      })

      if (response.ok) {
        const data = await response.json()
        setMockDomainResults(data.results)
        setShowResults(true)
      } else {
        console.error("Domain search failed")
      }
    } catch (error) {
      console.error("Domain search error:", error)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Find Your Perfect Domain</h2>
          <p className="text-xl text-gray-600 mb-8">
            Search millions of available domains and register instantly with competitive pricing
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-8">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Enter your domain name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-14 text-lg pl-4 pr-12"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isSearching || !searchTerm.trim()}
              className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-700"
            >
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>

          {showResults && (
            <Card className="max-w-3xl mx-auto">
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-6">Results for "{searchTerm}"</h3>
                <div className="space-y-4">
                  {mockDomainResults.map((result, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {result.available ? (
                            <Check className="h-5 w-5 text-green-500" />
                          ) : (
                            <X className="h-5 w-5 text-red-500" />
                          )}
                          <span className="font-medium text-lg">
                            {searchTerm}
                            {result.domain}
                          </span>
                        </div>
                        {result.popular && <Badge variant="secondary">Popular</Badge>}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xl font-bold text-blue-600">{result.price}/year</span>
                        <Button
                          disabled={!result.available}
                          variant={result.available ? "default" : "secondary"}
                          className={result.available ? "bg-blue-600 hover:bg-blue-700" : ""}
                        >
                          {result.available ? "Add to Cart" : "Unavailable"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  )
}
