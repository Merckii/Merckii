"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Check, X, ShoppingCart, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DomainResult {
  domain: string
  price: string
  available: boolean
  popular: boolean
}

export function DomainSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<DomainResult[]>([])
  const [cart, setCart] = useState<DomainResult[]>([])
  const { toast } = useToast()

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Please enter a domain name",
        variant: "destructive",
      })
      return
    }

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
        setResults(data.results || [])
        setShowResults(true)
        toast({
          title: "Domain search completed",
          description: `Found ${data.results?.length || 0} results for "${searchTerm}"`,
        })
      } else {
        throw new Error("Search failed")
      }
    } catch (error) {
      console.error("Domain search error:", error)
      toast({
        title: "Search failed",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const addToCart = (domain: DomainResult) => {
    if (!cart.find((item) => item.domain === domain.domain)) {
      setCart([...cart, domain])
      toast({
        title: "Added to cart",
        description: `${searchTerm}${domain.domain} added to your cart`,
      })
    }
  }

  const removeFromCart = (domainToRemove: string) => {
    setCart(cart.filter((item) => item.domain !== domainToRemove))
    toast({
      title: "Removed from cart",
      description: `Domain removed from your cart`,
    })
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
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                "Search"
              )}
            </Button>
          </div>

          {/* Cart Summary */}
          {cart.length > 0 && (
            <div className="mb-8">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">{cart.length} domain(s) in cart</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-blue-600">
                        Total: $
                        {cart.reduce((sum, item) => sum + Number.parseFloat(item.price.replace("$", "")), 0).toFixed(2)}
                      </span>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Checkout
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {showResults && (
            <Card className="max-w-3xl mx-auto">
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-6">Results for "{searchTerm}"</h3>
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
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
                        {result.available ? (
                          cart.find((item) => item.domain === result.domain) ? (
                            <Button
                              variant="outline"
                              onClick={() => removeFromCart(result.domain)}
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              Remove
                            </Button>
                          ) : (
                            <Button onClick={() => addToCart(result)} className="bg-blue-600 hover:bg-blue-700">
                              Add to Cart
                            </Button>
                          )
                        ) : (
                          <Button disabled variant="secondary">
                            Unavailable
                          </Button>
                        )}
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
